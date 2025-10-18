package com.vynlotaste.service;

import com.vynlotaste.entity.Financial;
import com.vynlotaste.repository.FinancialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for financial transaction operations
 * Handles business logic for financial management
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FinancialService {

    private final FinancialRepository financialRepository;

    @Transactional(readOnly = true)
    public Page<Financial> findAllTransactions(Pageable pageable) {
        try {
            log.info("Buscando todas as transações financeiras - página: {}, tamanho: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
            
            // MULTI-TENANCY: Filtrar por tenant_id
            Page<Financial> transactions;
            if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
                log.debug("🔑 Super Admin: retornando TODAS as transações financeiras");
                transactions = financialRepository.findAll(pageable);
            } else {
                Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
                if (tenantId == null) {
                    log.warn("⚠️ Tenant não definido - retornando página vazia");
                    return Page.empty(pageable);
                }
                log.debug("👤 Cliente (tenant_id={}): retornando transações do tenant", tenantId);
                transactions = financialRepository.findAllByTenantId(tenantId, pageable);
            }
            
            log.info("Transações encontradas: {} de {}", 
                transactions.getNumberOfElements(), transactions.getTotalElements());
            
            return transactions;
        } catch (Exception e) {
            log.error("Erro ao buscar transações financeiras", e);
            throw new RuntimeException("Erro interno ao buscar transações", e);
        }
    }

    public Financial createTransaction(FinancialRequestDto dto) {
        try {
            log.info("Criando nova transação financeira - tipo: {}, valor: {}", dto.getType(), dto.getAmount());
            
            // Validações de negócio
            validateTransactionRequest(dto);
            
            Financial transaction = new Financial();
            transaction.setType(dto.getType());
            transaction.setAmount(dto.getAmount());
            transaction.setDescription(dto.getDescription());
            transaction.setCategory(dto.getCategory());
            transaction.setDate(dto.getDate());
            transaction.setStatus("PENDING");
            transaction.setUser(dto.getUser());
            
            // MULTI-TENANCY: Setar tenant_id automaticamente
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            transaction.setTenantId(tenantId);
            log.debug("🔒 Financial será criado com tenant_id={}", tenantId);
            
            Financial savedTransaction = financialRepository.save(transaction);
            
            log.info("✅ Transação criada: ID={}, tipo={}, valor={}", 
                savedTransaction.getId(), savedTransaction.getType(), savedTransaction.getAmount());
            
            return savedTransaction;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao criar transação: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao criar transação financeira", e);
            throw new RuntimeException("Erro interno ao criar transação", e);
        }
    }

    @Transactional(readOnly = true)
    public Financial findById(Long id) {
        try {
            log.info("Buscando transação financeira por ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID da transação deve ser um número positivo");
            }
            
            Financial transaction = financialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada com ID: " + id));
            
            log.info("Transação encontrada - ID: {}, tipo: {}, valor: {}", 
                transaction.getId(), transaction.getType(), transaction.getAmount());
            
            return transaction;
        } catch (Exception e) {
            log.error("Erro ao buscar transação por ID: {}", id, e);
            throw new RuntimeException("Erro interno ao buscar transação", e);
        }
    }

    @Transactional
    public void deleteTransaction(Long id) {
        try {
            log.info("Deletando transação financeira - ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID da transação deve ser um número positivo");
            }
            
            Financial transaction = findById(id);
            financialRepository.delete(transaction);
            
            log.info("✅ Transação deletada: ID={}", id);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao deletar transação ID {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao deletar transação ID {}", id, e);
            throw new RuntimeException("Erro interno ao deletar transação", e);
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        try {
            log.info("Calculando resumo financeiro");
            
            // Buscar todas as transações confirmadas
            Page<Financial> allTransactions = financialRepository.findByStatus("CONFIRMED", Pageable.unpaged());
            
            BigDecimal totalIncome = BigDecimal.ZERO;
            BigDecimal totalExpense = BigDecimal.ZERO;
            
            for (Financial transaction : allTransactions.getContent()) {
                if ("INCOME".equals(transaction.getType())) {
                    totalIncome = totalIncome.add(transaction.getAmount());
                } else if ("EXPENSE".equals(transaction.getType())) {
                    totalExpense = totalExpense.add(transaction.getAmount());
                }
            }
            
            BigDecimal balance = totalIncome.subtract(totalExpense);
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalIncome", totalIncome);
            summary.put("totalExpense", totalExpense);
            summary.put("balance", balance);
            summary.put("totalTransactions", allTransactions.getTotalElements());
            
            log.info("✅ Resumo financeiro calculado - receitas: {}, despesas: {}, saldo: {}", 
                totalIncome, totalExpense, balance);
            
            return summary;
        } catch (Exception e) {
            log.error("❌ Erro ao calcular resumo financeiro", e);
            throw new RuntimeException("Erro interno ao calcular resumo", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<Financial> findByType(String type, Pageable pageable) {
        try {
            log.info("Buscando transações por tipo: {}", type);
            
            if (type == null || (!type.equals("INCOME") && !type.equals("EXPENSE"))) {
                throw new IllegalArgumentException("Tipo deve ser INCOME ou EXPENSE");
            }
            
            Page<Financial> transactions = financialRepository.findByType(type, pageable);
            
            log.info("✅ Transações encontradas por tipo {}: {}", type, transactions.getTotalElements());
            
            return transactions;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por tipo: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar transações por tipo: {}", type, e);
            throw new RuntimeException("Erro interno ao buscar transações", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<Financial> findByDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate, Pageable pageable) {
        try {
            log.info("Buscando transações por período: {} a {}", startDate, endDate);
            
            if (startDate == null || endDate == null) {
                throw new IllegalArgumentException("Datas de início e fim são obrigatórias");
            }
            
            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException("Data de início deve ser anterior à data de fim");
            }
            
            Page<Financial> transactions = financialRepository.findByDateBetween(startDate, endDate, pageable);
            
            log.info("✅ Transações encontradas no período: {}", transactions.getTotalElements());
            
            return transactions;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por período: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar transações por período", e);
            throw new RuntimeException("Erro interno ao buscar transações", e);
        }
    }

    private void validateTransactionRequest(FinancialRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Dados da transação não podem ser nulos");
        }
        
        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        
        if (dto.getType() == null || (!dto.getType().equals("INCOME") && !dto.getType().equals("EXPENSE"))) {
            throw new IllegalArgumentException("Tipo deve ser INCOME ou EXPENSE");
        }
        
        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição é obrigatória");
        }
        
        if (dto.getCategory() == null || dto.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Categoria é obrigatória");
        }
        
        if (dto.getDate() == null) {
            throw new IllegalArgumentException("Data é obrigatória");
        }
        
        if (dto.getUser() == null) {
            throw new IllegalArgumentException("Usuário é obrigatório");
        }
    }

    @Transactional
    public Financial updateTransaction(Long id, FinancialRequestDto dto) {
        try {
            log.info("Atualizando transação financeira - ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID da transação deve ser um número positivo");
            }
            
            validateTransactionRequest(dto);
            
            Financial transaction = findById(id);
            transaction.setType(dto.getType());
            transaction.setAmount(dto.getAmount());
            transaction.setDescription(dto.getDescription());
            transaction.setCategory(dto.getCategory());
            transaction.setDate(dto.getDate());
            
            Financial updatedTransaction = financialRepository.save(transaction);
            
            log.info("✅ Transação atualizada: ID={}, tipo={}, valor={}", 
                updatedTransaction.getId(), updatedTransaction.getType(), updatedTransaction.getAmount());
            
            return updatedTransaction;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao atualizar transação ID {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao atualizar transação ID {}", id, e);
            throw new RuntimeException("Erro interno ao atualizar transação", e);
        }
    }

    @Transactional
    public Financial updateTransactionStatus(Long id, String status) {
        try {
            log.info("Atualizando status da transação - ID: {}, novo status: {}", id, status);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID da transação deve ser um número positivo");
            }
            
            if (status == null || (!status.equals("PENDING") && !status.equals("CONFIRMED") && !status.equals("CANCELLED"))) {
                throw new IllegalArgumentException("Status deve ser PENDING, CONFIRMED ou CANCELLED");
            }
            
            Financial transaction = findById(id);
            transaction.setStatus(status);
            
            Financial updatedTransaction = financialRepository.save(transaction);
            
            log.info("✅ Status da transação atualizado: ID={}, status={}", 
                updatedTransaction.getId(), updatedTransaction.getStatus());
            
            return updatedTransaction;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao atualizar status da transação ID {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao atualizar status da transação ID {}", id, e);
            throw new RuntimeException("Erro interno ao atualizar status", e);
        }
    }

    // DTO interno para request
    public static class FinancialRequestDto {
        private String type;
        private BigDecimal amount;
        private String description;
        private String category;
        private java.time.LocalDate date;
        private com.vynlotaste.entity.User user;

        // Getters e Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public java.time.LocalDate getDate() { return date; }
        public void setDate(java.time.LocalDate date) { this.date = date; }
        
        public com.vynlotaste.entity.User getUser() { return user; }
        public void setUser(com.vynlotaste.entity.User user) { this.user = user; }
    }
}