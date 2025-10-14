package com.vynlotaste.controller;

import com.vynlotaste.dto.CashFlowResponseDto;
import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.entity.CashFlow;
import com.vynlotaste.mapper.CashFlowMapper;
import com.vynlotaste.service.CashFlowService;
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
@RequestMapping("/v1/cashflow")
@RequiredArgsConstructor
public class CashFlowController {
    // v2.1.2 - POSTs agora chamam services reais (não mock)
    // Modified: 2025-10-11-v28

    private final CashFlowService cashFlowService;
    private final CashFlowMapper cashFlowMapper;

    @GetMapping("/entries")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponseDto<CashFlowResponseDto>> getCashFlowEntries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            log.info("Buscando entradas do fluxo de caixa - página: {}, tamanho: {}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<CashFlow> cashFlows = cashFlowService.findAllEntries(pageable);
            List<CashFlowResponseDto> response = cashFlows.stream()
                .map(cashFlowMapper::toResponseDto)
                .toList();
            log.info("Entradas encontradas: {}", response.size());
            return ResponseEntity.ok(PagedResponseDto.of(response, page, size, cashFlows.getTotalElements()));
        } catch (Exception e) {
            log.error("Erro ao buscar entradas do fluxo de caixa: {}", e.getMessage(), e);
            PagedResponseDto<CashFlowResponseDto> fallback = PagedResponseDto.of(
                Collections.emptyList(), page, size, 0L
            );
            return ResponseEntity.ok(fallback);
        }
    }

    @PostMapping("/entries")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CashFlowResponseDto> createCashFlowEntry(@RequestBody CashFlowService.CashFlowRequestDto request) {
        try {
            log.info("Criando nova entrada de fluxo de caixa - tipo: {}, valor: {}", request.getType(), request.getAmount());
            CashFlow cashFlow = cashFlowService.createEntry(request);
            CashFlowResponseDto response = cashFlowMapper.toResponseDto(cashFlow);
            log.info("✅ Entrada criada: ID={}, tipo={}, valor={}", cashFlow.getId(), cashFlow.getType(), cashFlow.getAmount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Erro ao criar entrada: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao criar entrada de fluxo de caixa: " + e.getMessage(), e);
        }
    }

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getCashFlowSummary() {
        try {
            log.info("Buscando resumo do fluxo de caixa");
            Map<String, Object> summary = cashFlowService.getSummary();
            log.info("Resumo calculado com sucesso");
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Erro ao buscar resumo do fluxo de caixa: {}", e.getMessage(), e);
            Map<String, Object> fallback = Map.of(
                "income", 0.0,
                "expense", 0.0,
                "balance", 0.0,
                "totalEntries", 0
            );
            return ResponseEntity.ok(fallback);
        }
    }


}