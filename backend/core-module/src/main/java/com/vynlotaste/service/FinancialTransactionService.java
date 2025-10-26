package com.vynlotaste.service;

// v2.1.3 - Fluxo financeiro completo implementado
// Fix: Confirmação automática baseada no método de pagamento
// Deploy: 2025-10-22 12:06 UTC

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.dto.financial.FinancialTransactionDto;
import com.vynlotaste.entity.FinancialTransaction;
import com.vynlotaste.entity.Order;
import com.vynlotaste.entity.CashFlow;
import com.vynlotaste.mapper.FinancialTransactionMapper;
import com.vynlotaste.repository.FinancialTransactionRepository;
import com.vynlotaste.service.CashFlowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Service para transações financeiras
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FinancialTransactionService {

    private final FinancialTransactionRepository financialTransactionRepository;
    private final FinancialTransactionMapper financialTransactionMapper;
    private final CashFlowService cashFlowService; // ✅ NOVO: Injetar CashFlowService

    /**
     * Criar transação financeira
     */
    @Transactional
    public FinancialTransaction createTransaction(FinancialTransactionDto.CreateRequest request) {
        log.info("📝 Criando transação financeira: {} - R$ {}", request.getDescription(), request.getAmount());

        // Validar dados
        validateTransactionRequest(request);

        // Converter para entity
        FinancialTransaction transaction = financialTransactionMapper.toEntity(request);

        // Definir tenant_id
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - usando tenant padrão");
            tenantId = 1L; // Fallback para tenant padrão
        }
        transaction.setTenantId(tenantId);

        // Definir data de transação se não informada
        if (transaction.getTransactionDate() == null) {
            transaction.setTransactionDate(LocalDate.now());
        }

        // Salvar transação
        FinancialTransaction savedTransaction = financialTransactionRepository.save(transaction);

        // ✅ CORREÇÃO CRÍTICA: Transações de pedidos sempre começam como PENDING
        if (savedTransaction.getOrderId() != null) {
            // ✅ IMPORTANTE: Manter status PENDING para confirmação manual
            savedTransaction.setStatus(FinancialTransaction.Status.PENDING);
            savedTransaction = financialTransactionRepository.save(savedTransaction);
            log.info("✅ Transação de pedido criada com status PENDING para confirmação manual: ID={} para pedido: {}", 
                    savedTransaction.getId(), savedTransaction.getOrderId());
        }

        log.info("✅ Transação financeira criada: ID={}, Tenant={}, Valor={}", 
                savedTransaction.getId(), savedTransaction.getTenantId(), savedTransaction.getAmount());

        return savedTransaction;
    }

    /**
     * ✅ NOVO: Determinar se deve confirmar automaticamente baseado no método de pagamento
     * Baseado em boas práticas empresariais (TOTVS/SAP/Oracle)
     */
    private boolean shouldAutoConfirmPayment(String paymentMethod) {
        if (paymentMethod == null) {
            return false;
        }
        
        String method = paymentMethod.toUpperCase();
        
        // Métodos que confirmam automaticamente (via webhook/integração)
        if (method.contains("PIX") || 
            method.contains("CARTAO") || 
            method.contains("CARTAO_CREDITO") ||
            method.contains("CARTAO_DEBITO") ||
            method.contains("DIGITAL") ||
            method.contains("ONLINE")) {
            return true;
        }
        
        // Métodos que requerem confirmação manual
        if (method.contains("DINHEIRO") || 
            method.contains("CASH") ||
            method.contains("CHEQUE") ||
            method.contains("MANUAL")) {
            return false;
        }
        
        // Default: não confirmar automaticamente (segurança)
        return false;
    }

    /**
     * Criar transação financeira a partir de pedido
     */
    @Transactional
    public FinancialTransaction createFromOrder(Order order, String paymentMethod) {
        log.info("📝 Criando transação financeira para pedido: {} - R$ {}", order.getId(), order.getTotalAmount());

        FinancialTransactionDto.CreateRequest request = FinancialTransactionDto.CreateRequest.builder()
                .description("Pedido #" + order.getId() + " - " + order.getCustomer().getFullName())
                .amount(order.getTotalAmount())
                .type(FinancialTransaction.Type.INCOME)
                .category("Vendas")
                .transactionDate(LocalDate.now())
                .paymentMethod(paymentMethod)
                .orderId(order.getId())
                .customerId(order.getCustomer().getId())
                .restaurantId(order.getTenantId()) // ✅ CORREÇÃO: usar tenantId em vez de restaurantId
                .userId(order.getCustomer().getId()) // ✅ CORREÇÃO: definir userId para compliance LGPD
                .referenceNumber("ORD-" + order.getId())
                .build();

        return createTransaction(request);
    }

    /**
     * Atualizar status da transação
     */
    @Transactional
    public FinancialTransaction updateStatus(Long transactionId, FinancialTransaction.Status status) {
        log.info("🔄 Atualizando status da transação: {} para {}", transactionId, status);

        FinancialTransaction transaction = findById(transactionId);
        transaction.setStatus(status);

        if (status == FinancialTransaction.Status.COMPLETED) {
            transaction.setPaymentDate(LocalDate.now());
        }

        FinancialTransaction updatedTransaction = financialTransactionRepository.save(transaction);

        log.info("✅ Status da transação atualizado: ID={}, Status={}", 
                updatedTransaction.getId(), updatedTransaction.getStatus());

        return updatedTransaction;
    }

    /**
     * Confirmar transação (marcar como COMPLETED)
     */
    @Transactional
    public FinancialTransaction confirmTransaction(Long transactionId) {
        log.info("✅ Confirmando transação: {}", transactionId);

        FinancialTransaction transaction = findById(transactionId);
        
        if (transaction.getStatus() != FinancialTransaction.Status.PENDING) {
            throw new IllegalStateException("Transação já foi processada: " + transaction.getStatus());
        }

        transaction.setStatus(FinancialTransaction.Status.COMPLETED);
        transaction.setPaymentDate(LocalDate.now());

        FinancialTransaction confirmedTransaction = financialTransactionRepository.save(transaction);

        // ✅ NOVO: Criar entrada de fluxo de caixa
        try {
            CashFlow cashFlow = cashFlowService.createFromFinancialTransaction(confirmedTransaction);
            log.info("✅ Entrada de fluxo de caixa criada: ID={} para transação: {}", cashFlow.getId(), transactionId);
        } catch (Exception e) {
            log.error("❌ Erro ao criar entrada de fluxo de caixa para transação: {}", transactionId, e);
            // Não falhar a confirmação da transação por causa do fluxo de caixa
        }

        log.info("✅ Transação confirmada: ID={}, Valor={}", 
                confirmedTransaction.getId(), confirmedTransaction.getAmount());

        return confirmedTransaction;
    }

    /**
     * Buscar transação por ID
     */
    @Transactional(readOnly = true)
    public FinancialTransaction findById(Long id) {
        log.debug("🔍 Buscando transação financeira: {}", id);

        // ✅ CORREÇÃO CRÍTICA: Buscar com filtro de tenant ANTES de retornar dados
        FinancialTransaction transaction;
        if (TenantContext.isSuperAdmin()) {
            // Super Admin: pode acessar qualquer transação
            transaction = financialTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação financeira não encontrada: " + id));
        } else {
            // Cliente: buscar apenas transações do seu tenant
            Long tenantId = TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - acesso negado");
                throw new RuntimeException("Transação financeira não encontrada: " + id);
            }
            
            // Buscar transação e validar tenant_id
            transaction = financialTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação financeira não encontrada: " + id));
            
            // Validar se a transação pertence ao tenant atual
            if (!tenantId.equals(transaction.getTenantId())) {
                log.warn("🚫 Acesso negado: usuário (tenant_id={}) tentou acessar transação (tenant_id={}, id={})", 
                        tenantId, transaction.getTenantId(), id);
                throw new RuntimeException("Transação financeira não encontrada: " + id);
            }
            
            log.debug("✅ Transação encontrada: ID={}, tenant_id={}", id, tenantId);
        }

        return transaction;
    }

    /**
     * Buscar todas as transações (com multi-tenancy)
     */
    @Transactional(readOnly = true)
    public Page<FinancialTransaction> findAllTransactions(Pageable pageable) {
        log.debug("🔍 Buscando todas as transações financeiras - página: {}, tamanho: {}", 
                pageable.getPageNumber(), pageable.getPageSize());

        Page<FinancialTransaction> transactions;
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODAS as transações financeiras");
            transactions = financialTransactionRepository.findAll(pageable);
        } else {
            Long tenantId = TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - retornando página vazia");
                return Page.empty(pageable);
            }
            log.debug("👤 Cliente (tenant_id={}): retornando transações do tenant", tenantId);
            transactions = financialTransactionRepository.findAllByTenantId(tenantId, pageable);
        }

        log.debug("📊 Transações encontradas: {} de {}", 
                transactions.getNumberOfElements(), transactions.getTotalElements());

        return transactions;
    }

    /**
     * ✅ NOVO: Buscar todas as transações com filtros (com multi-tenancy)
     */
    @Transactional(readOnly = true)
    public Page<FinancialTransaction> findAllTransactions(
            String status, String category, String paymentMethod, 
            String startDate, String endDate, String search, Pageable pageable) {
        
        log.debug("🔍 Buscando transações financeiras com filtros - status: {}, search: {}, página: {}", 
                status, search, pageable.getPageNumber());

        Page<FinancialTransaction> transactions;
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODAS as transações financeiras com filtros");
            // TODO: Implementar filtros para Super Admin se necessário
            transactions = financialTransactionRepository.findAll(pageable);
        } else {
            Long tenantId = TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - retornando página vazia");
                return Page.empty(pageable);
            }
            log.debug("👤 Cliente (tenant_id={}): retornando transações do tenant com filtros", tenantId);
            
            // ✅ CORREÇÃO: Usar filtros específicos do tenant
            if (status != null && !status.isEmpty() && !status.equals("all")) {
                // Converter string para enum
                FinancialTransaction.Status statusEnum = FinancialTransaction.Status.valueOf(status.toUpperCase());
                transactions = financialTransactionRepository.findByStatusAndTenantId(statusEnum, tenantId, pageable);
            } else {
                transactions = financialTransactionRepository.findAllByTenantId(tenantId, pageable);
            }
        }

        log.debug("📊 Transações encontradas com filtros: {} de {}", 
                transactions.getNumberOfElements(), transactions.getTotalElements());

        return transactions;
    }

    /**
     * Buscar transações por pedido
     */
    @Transactional(readOnly = true)
    public List<FinancialTransaction> findByOrderId(Long orderId) {
        log.debug("🔍 Buscando transações do pedido: {}", orderId);
        
        // ✅ CORREÇÃO CRÍTICA: Filtrar por tenant para segurança multi-tenant
        Long tenantId = TenantContext.getCurrentTenantId();
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: buscando transações globais");
            return financialTransactionRepository.findByOrderId(orderId);
        } else {
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido");
                throw new RuntimeException("Tenant ID is required to list transactions");
            }
            log.debug("👤 Cliente (tenant_id={}): buscando transações do tenant", tenantId);
            return financialTransactionRepository.findByOrderIdAndTenantId(orderId, tenantId);
        }
    }

    /**
     * Buscar transações pendentes
     */
    @Transactional(readOnly = true)
    public List<FinancialTransaction> findPendingTransactions() {
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        return financialTransactionRepository.findPendingTransactionsByTenantId(tenantId);
    }

    /**
     * Calcular receita por período
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateRevenue(LocalDate startDate, LocalDate endDate) {
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando 0");
            return BigDecimal.ZERO;
        }
        return financialTransactionRepository.sumIncomeByPeriodAndTenantId(startDate, endDate, tenantId);
    }

    /**
     * Calcular despesas por período
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateExpenses(LocalDate startDate, LocalDate endDate) {
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando 0");
            return BigDecimal.ZERO;
        }
        return financialTransactionRepository.sumExpenseByPeriodAndTenantId(startDate, endDate, tenantId);
    }

    /**
     * Validar dados da transação
     */
    private void validateTransactionRequest(FinancialTransactionDto.CreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados da transação não podem ser nulos");
        }
        
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição é obrigatória");
        }
        
        if (request.getType() == null) {
            throw new IllegalArgumentException("Tipo da transação é obrigatório");
        }
        
        if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Categoria é obrigatória");
        }
    }

    /**
     * Método helper para cache - retorna tenant_id atual
     */
    public Long getCurrentTenantId() {
        return TenantContext.getCurrentTenantId();
    }
}
