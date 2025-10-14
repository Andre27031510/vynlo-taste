package com.vynlotaste.controller;

import com.vynlotaste.dto.FinancialResponseDto;
import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.entity.Financial;
import com.vynlotaste.mapper.FinancialMapper;
import com.vynlotaste.service.FinancialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/financial")
@RequiredArgsConstructor
public class FinancialController {
    // v2.1.2 - POSTs agora chamam services reais (não mock)
    // Modified: 2025-10-11-v30

    private final FinancialService financialService;
    private final FinancialMapper financialMapper;

    @GetMapping("/accounts/payable")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponseDto<FinancialResponseDto>> getAccountsPayable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            log.info("Buscando contas a pagar - página: {}, tamanho: {}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<Financial> financials = financialService.findAllTransactions(pageable);
            List<FinancialResponseDto> response = financials.stream()
                .map(financialMapper::toResponseDto)
                .toList();
            log.info("Contas a pagar encontradas: {}", response.size());
            return ResponseEntity.ok(PagedResponseDto.of(response, page, size, financials.getTotalElements()));
        } catch (Exception e) {
            log.error("Erro ao buscar contas a pagar: {}", e.getMessage(), e);
            PagedResponseDto<FinancialResponseDto> fallback = PagedResponseDto.of(
                Collections.emptyList(), page, size, 0L
            );
            return ResponseEntity.ok(fallback);
        }
    }

    @GetMapping("/accounts/receivable")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponseDto<FinancialResponseDto>> getAccountsReceivable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            log.info("Buscando contas a receber - página: {}, tamanho: {}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<Financial> financials = financialService.findAllTransactions(pageable);
            List<FinancialResponseDto> response = financials.stream()
                .map(financialMapper::toResponseDto)
                .toList();
            log.info("Contas a receber encontradas: {}", response.size());
            return ResponseEntity.ok(PagedResponseDto.of(response, page, size, financials.getTotalElements()));
        } catch (Exception e) {
            log.error("Erro ao buscar contas a receber: {}", e.getMessage(), e);
            PagedResponseDto<FinancialResponseDto> fallback = PagedResponseDto.of(
                Collections.emptyList(), page, size, 0L
            );
            return ResponseEntity.ok(fallback);
        }
    }

    @PostMapping("/transactions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FinancialResponseDto> createTransaction(@RequestBody FinancialService.FinancialRequestDto request) {
        try {
            log.info("Criando nova transação financeira - tipo: {}, valor: {}", request.getType(), request.getAmount());
            Financial financial = financialService.createTransaction(request);
            FinancialResponseDto response = financialMapper.toResponseDto(financial);
            log.info("✅ Transação criada: ID={}, tipo={}", financial.getId(), financial.getType());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Erro ao criar transação: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao criar transação financeira: " + e.getMessage(), e);
        }
    }

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getFinancialSummary() {
        try {
            log.info("Buscando resumo financeiro");
            Map<String, Object> summary = financialService.getSummary();
            log.info("Resumo financeiro calculado com sucesso");
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Erro ao buscar resumo financeiro: {}", e.getMessage(), e);
            Map<String, Object> fallback = Map.of(
                "totalIncome", 0.0,
                "totalExpense", 0.0,
                "balance", 0.0,
                "totalTransactions", 0
            );
            return ResponseEntity.ok(fallback);
        }
    }


}