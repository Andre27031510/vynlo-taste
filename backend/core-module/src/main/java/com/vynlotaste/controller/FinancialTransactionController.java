package com.vynlotaste.controller;

import com.vynlotaste.dto.financial.FinancialTransactionDto;
import com.vynlotaste.entity.FinancialTransaction;
import com.vynlotaste.mapper.FinancialTransactionMapper;
import com.vynlotaste.service.FinancialTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Controller para transações financeiras
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@RestController
@RequestMapping("/v1/financial-transactions")
@RequiredArgsConstructor
@Slf4j
public class FinancialTransactionController {

    private final FinancialTransactionService financialTransactionService;
    private final FinancialTransactionMapper financialTransactionMapper;

    /**
     * Criar transação financeira
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FinancialTransactionDto.Response> createTransaction(
            @Valid @RequestBody FinancialTransactionDto.CreateRequest request) {
        
        log.info("📝 Criando transação financeira: {} - R$ {}", request.getDescription(), request.getAmount());
        
        FinancialTransaction transaction = financialTransactionService.createTransaction(request);
        FinancialTransactionDto.Response response = financialTransactionMapper.toResponseDto(transaction);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Buscar todas as transações financeiras
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<FinancialTransactionDto.Response>> getAllTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Pageable pageable) {
        
        log.debug("🔍 Buscando transações financeiras - página: {}, tamanho: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<FinancialTransaction> transactions = financialTransactionService.findAllTransactions(pageable);
        Page<FinancialTransactionDto.Response> response = transactions.map(financialTransactionMapper::toResponseDto);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Buscar transação por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FinancialTransactionDto.Response> getTransactionById(@PathVariable Long id) {
        log.debug("🔍 Buscando transação financeira: {}", id);
        
        FinancialTransaction transaction = financialTransactionService.findById(id);
        FinancialTransactionDto.Response response = financialTransactionMapper.toResponseDto(transaction);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Buscar transações por pedido
     */
    @GetMapping("/order/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FinancialTransactionDto.Response>> getTransactionsByOrderId(@PathVariable Long orderId) {
        log.debug("🔍 Buscando transações do pedido: {}", orderId);
        
        List<FinancialTransaction> transactions = financialTransactionService.findByOrderId(orderId);
        List<FinancialTransactionDto.Response> response = financialTransactionMapper.toResponseDtoList(transactions);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Buscar transações pendentes
     */
    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FinancialTransactionDto.Response>> getPendingTransactions() {
        log.debug("🔍 Buscando transações pendentes");
        
        List<FinancialTransaction> transactions = financialTransactionService.findPendingTransactions();
        List<FinancialTransactionDto.Response> response = financialTransactionMapper.toResponseDtoList(transactions);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Atualizar status da transação
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FinancialTransactionDto.Response> updateTransactionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        log.info("🔄 Atualizando status da transação: {} para {}", id, status);
        
        FinancialTransaction.Status transactionStatus = FinancialTransaction.Status.valueOf(status.toUpperCase());
        FinancialTransaction transaction = financialTransactionService.updateStatus(id, transactionStatus);
        FinancialTransactionDto.Response response = financialTransactionMapper.toResponseDto(transaction);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Confirmar transação
     */
    @PostMapping("/{id}/confirm")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FinancialTransactionDto.Response> confirmTransaction(@PathVariable Long id) {
        log.info("✅ Confirmando transação: {}", id);
        
        FinancialTransaction transaction = financialTransactionService.confirmTransaction(id);
        FinancialTransactionDto.Response response = financialTransactionMapper.toResponseDto(transaction);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Calcular receita por período
     */
    @GetMapping("/revenue")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BigDecimal> calculateRevenue(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        log.debug("💰 Calculando receita de {} até {}", startDate, endDate);
        
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        BigDecimal revenue = financialTransactionService.calculateRevenue(start, end);
        
        return ResponseEntity.ok(revenue);
    }

    /**
     * Calcular despesas por período
     */
    @GetMapping("/expenses")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BigDecimal> calculateExpenses(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        log.debug("💸 Calculando despesas de {} até {}", startDate, endDate);
        
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        BigDecimal expenses = financialTransactionService.calculateExpenses(start, end);
        
        return ResponseEntity.ok(expenses);
    }

    /**
     * Estatísticas das transações financeiras
     */
    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTransactionStats() {
        try {
            log.debug("📊 Buscando estatísticas das transações financeiras");
            
            // Calcular estatísticas do período atual
            LocalDate today = LocalDate.now();
            LocalDate startOfMonth = today.withDayOfMonth(1);
            
            BigDecimal monthlyRevenue = financialTransactionService.calculateRevenue(startOfMonth, today);
            BigDecimal monthlyExpenses = financialTransactionService.calculateExpenses(startOfMonth, today);
            BigDecimal netIncome = monthlyRevenue.subtract(monthlyExpenses);
            
            List<FinancialTransaction> pendingTransactions = financialTransactionService.findPendingTransactions();
            
            return ResponseEntity.ok(java.util.Map.of(
                "monthlyRevenue", monthlyRevenue,
                "monthlyExpenses", monthlyExpenses,
                "netIncome", netIncome,
                "pendingTransactions", pendingTransactions.size(),
                "period", startOfMonth + " até " + today
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estatísticas das transações financeiras: {}", e.getMessage(), e);
            return ResponseEntity.ok(java.util.Map.of(
                "monthlyRevenue", BigDecimal.ZERO,
                "monthlyExpenses", BigDecimal.ZERO,
                "netIncome", BigDecimal.ZERO,
                "pendingTransactions", 0,
                "period", "Erro ao calcular período"
            ));
        }
    }
}
