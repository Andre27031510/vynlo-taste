package com.vynlotaste.service;

import com.vynlotaste.entity.CashFlow;
import com.vynlotaste.repository.CashFlowRepository;
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
 * Service for cash flow operations
 * Handles business logic for cash flow management
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CashFlowService {

    private final CashFlowRepository cashFlowRepository;

    @Transactional(readOnly = true)
    public Page<CashFlow> findAllEntries(Pageable pageable) {
        try {
            log.info("Buscando todas as entradas de fluxo de caixa - página: {}, tamanho: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
            
            Page<CashFlow> entries = cashFlowRepository.findAll(pageable);
            
            log.info("Entradas encontradas: {} de {}", 
                entries.getNumberOfElements(), entries.getTotalElements());
            
            return entries;
        } catch (Exception e) {
            log.error("Erro ao buscar entradas de fluxo de caixa", e);
            throw new RuntimeException("Erro interno ao buscar entradas", e);
        }
    }

    @Transactional
    public CashFlow createEntry(CashFlowRequestDto dto) {
        try {
            log.info("Criando nova entrada de fluxo de caixa - tipo: {}, valor: {}", dto.getType(), dto.getAmount());
            
            // Validações de negócio
            validateCashFlowRequest(dto);
            
            CashFlow entry = new CashFlow();
            entry.setType(dto.getType());
            entry.setCategory(dto.getCategory());
            entry.setDescription(dto.getDescription());
            entry.setAmount(dto.getAmount());
            entry.setDate(dto.getDate());
            entry.setStatus("CONFIRMED"); // CashFlow é confirmado por padrão
            entry.setUser(dto.getUser());
            
            // MULTI-TENANCY: Setar tenant_id automaticamente
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            entry.setTenantId(tenantId);
            log.debug("🔒 CashFlow será criado com tenant_id={}", tenantId);
            
            CashFlow savedEntry = cashFlowRepository.save(entry);
            
            log.info("✅ Entrada de fluxo de caixa criada: ID={}, tipo={}, valor={}", 
                savedEntry.getId(), savedEntry.getType(), savedEntry.getAmount());
            
            return savedEntry;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao criar entrada: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao criar entrada de fluxo de caixa", e);
            throw new RuntimeException("Erro interno ao criar entrada", e);
        }
    }

    @Transactional(readOnly = true)
    public CashFlow findById(Long id) {
        try {
            log.info("Buscando entrada de fluxo de caixa por ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID da entrada deve ser um número positivo");
            }
            
            CashFlow entry = cashFlowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrada não encontrada com ID: " + id));
            
            log.info("Entrada encontrada - ID: {}, tipo: {}, valor: {}", 
                entry.getId(), entry.getType(), entry.getAmount());
            
            return entry;
        } catch (Exception e) {
            log.error("Erro ao buscar entrada por ID: {}", id, e);
            throw new RuntimeException("Erro interno ao buscar entrada", e);
        }
    }

    @Transactional
    public void deleteEntry(Long id) {
        try {
            log.info("Deletando entrada de fluxo de caixa - ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID da entrada deve ser um número positivo");
            }
            
            CashFlow entry = findById(id);
            cashFlowRepository.delete(entry);
            
            log.info("✅ Entrada deletada: ID={}", id);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao deletar entrada ID {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao deletar entrada ID {}", id, e);
            throw new RuntimeException("Erro interno ao deletar entrada", e);
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        try {
            log.info("Calculando resumo do fluxo de caixa");
            
            // Buscar todas as entradas confirmadas
            Page<CashFlow> allEntries = cashFlowRepository.findByStatus("CONFIRMED", Pageable.unpaged());
            
            BigDecimal totalIncome = BigDecimal.ZERO;
            BigDecimal totalExpense = BigDecimal.ZERO;
            
            for (CashFlow entry : allEntries.getContent()) {
                if ("INCOME".equals(entry.getType())) {
                    totalIncome = totalIncome.add(entry.getAmount());
                } else if ("EXPENSE".equals(entry.getType())) {
                    totalExpense = totalExpense.add(entry.getAmount());
                }
            }
            
            BigDecimal balance = totalIncome.subtract(totalExpense);
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("income", totalIncome);
            summary.put("expense", totalExpense);
            summary.put("balance", balance);
            summary.put("totalEntries", allEntries.getTotalElements());
            
            log.info("✅ Resumo do fluxo de caixa calculado - entradas: {}, saídas: {}, saldo: {}", 
                totalIncome, totalExpense, balance);
            
            return summary;
        } catch (Exception e) {
            log.error("❌ Erro ao calcular resumo do fluxo de caixa", e);
            throw new RuntimeException("Erro interno ao calcular resumo", e);
        }
    }

    @Transactional
    public CashFlow updateEntry(Long id, CashFlowRequestDto dto) {
        try {
            log.info("Atualizando entrada de fluxo de caixa - ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID da entrada deve ser um número positivo");
            }
            
            validateCashFlowRequest(dto);
            
            CashFlow entry = findById(id);
            entry.setType(dto.getType());
            entry.setCategory(dto.getCategory());
            entry.setDescription(dto.getDescription());
            entry.setAmount(dto.getAmount());
            entry.setDate(dto.getDate());
            
            CashFlow updatedEntry = cashFlowRepository.save(entry);
            
            log.info("✅ Entrada atualizada: ID={}, tipo={}, valor={}", 
                updatedEntry.getId(), updatedEntry.getType(), updatedEntry.getAmount());
            
            return updatedEntry;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao atualizar entrada ID {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao atualizar entrada ID {}", id, e);
            throw new RuntimeException("Erro interno ao atualizar entrada", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<CashFlow> findByType(String type, Pageable pageable) {
        try {
            log.info("Buscando entradas por tipo: {}", type);
            
            if (type == null || (!type.equals("INCOME") && !type.equals("EXPENSE"))) {
                throw new IllegalArgumentException("Tipo deve ser INCOME ou EXPENSE");
            }
            
            Page<CashFlow> entries = cashFlowRepository.findByType(type, pageable);
            
            log.info("✅ Entradas encontradas por tipo {}: {}", type, entries.getTotalElements());
            
            return entries;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por tipo: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar entradas por tipo: {}", type, e);
            throw new RuntimeException("Erro interno ao buscar entradas", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<CashFlow> findByDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate, Pageable pageable) {
        try {
            log.info("Buscando entradas por período: {} a {}", startDate, endDate);
            
            if (startDate == null || endDate == null) {
                throw new IllegalArgumentException("Datas de início e fim são obrigatórias");
            }
            
            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException("Data de início deve ser anterior à data de fim");
            }
            
            Page<CashFlow> entries = cashFlowRepository.findByDateBetween(startDate, endDate, pageable);
            
            log.info("✅ Entradas encontradas no período: {}", entries.getTotalElements());
            
            return entries;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por período: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar entradas por período", e);
            throw new RuntimeException("Erro interno ao buscar entradas", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<CashFlow> findByCategory(String category, Pageable pageable) {
        try {
            log.info("Buscando entradas por categoria: {}", category);
            
            if (category == null || category.trim().isEmpty()) {
                throw new IllegalArgumentException("Categoria é obrigatória");
            }
            
            Page<CashFlow> entries = cashFlowRepository.findByCategory(category, pageable);
            
            log.info("✅ Entradas encontradas por categoria {}: {}", category, entries.getTotalElements());
            
            return entries;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por categoria: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar entradas por categoria: {}", category, e);
            throw new RuntimeException("Erro interno ao buscar entradas", e);
        }
    }

    private void validateCashFlowRequest(CashFlowRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Dados da entrada não podem ser nulos");
        }
        
        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        
        if (dto.getType() == null || (!dto.getType().equals("INCOME") && !dto.getType().equals("EXPENSE"))) {
            throw new IllegalArgumentException("Tipo deve ser INCOME ou EXPENSE");
        }
        
        if (dto.getCategory() == null || dto.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Categoria é obrigatória");
        }
        
        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição é obrigatória");
        }
        
        if (dto.getDate() == null) {
            throw new IllegalArgumentException("Data é obrigatória");
        }
        
        // Validar que a data não é no futuro
        if (dto.getDate().isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Data não pode ser no futuro");
        }
        
        if (dto.getUser() == null) {
            throw new IllegalArgumentException("Usuário é obrigatório");
        }
    }

    // DTO interno para request
    public static class CashFlowRequestDto {
        private String type;
        private String category;
        private String description;
        private BigDecimal amount;
        private java.time.LocalDate date;
        private com.vynlotaste.entity.User user;

        // Getters e Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public java.time.LocalDate getDate() { return date; }
        public void setDate(java.time.LocalDate date) { this.date = date; }
        
        public com.vynlotaste.entity.User getUser() { return user; }
        public void setUser(com.vynlotaste.entity.User user) { this.user = user; }
    }
}