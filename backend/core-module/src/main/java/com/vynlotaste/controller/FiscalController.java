package com.vynlotaste.controller;

import com.vynlotaste.dto.FiscalDocumentResponseDto;
import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.entity.FiscalDocument;
import com.vynlotaste.mapper.FiscalDocumentMapper;
import com.vynlotaste.service.FiscalDocumentService;
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
@RequestMapping("/v1/fiscal")
@RequiredArgsConstructor
public class FiscalController {
    // v2.1.2 - POSTs agora chamam services reais (não mock)
    // Modified: 2025-10-11-v29

    private final FiscalDocumentService fiscalDocumentService;
    private final FiscalDocumentMapper fiscalDocumentMapper;

    @GetMapping("/documents")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponseDto<FiscalDocumentResponseDto>> getFiscalDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            log.info("Buscando documentos fiscais - página: {}, tamanho: {}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<FiscalDocument> documents = fiscalDocumentService.findAll(pageable);
            List<FiscalDocumentResponseDto> response = documents.stream()
                .map(fiscalDocumentMapper::toResponseDto)
                .toList();
            log.info("Documentos encontrados: {}", response.size());
            return ResponseEntity.ok(PagedResponseDto.of(response, page, size, documents.getTotalElements()));
        } catch (Exception e) {
            log.error("Erro ao buscar documentos fiscais: {}", e.getMessage(), e);
            PagedResponseDto<FiscalDocumentResponseDto> fallback = PagedResponseDto.of(
                Collections.emptyList(), page, size, 0L
            );
            return ResponseEntity.ok(fallback);
        }
    }

    @PostMapping("/nfe")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FiscalDocumentResponseDto> issueNFe(@RequestBody FiscalDocumentService.NFeRequestDto request) {
        try {
            log.info("Emitindo NFe - cliente: {}", request.getCustomer());
            FiscalDocument document = fiscalDocumentService.emitNFe(request);
            FiscalDocumentResponseDto response = fiscalDocumentMapper.toResponseDto(document);
            log.info("✅ NFe emitida: ID={}, número={}", document.getId(), document.getNumber());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Erro ao emitir NFe: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao emitir NFe: " + e.getMessage(), e);
        }
    }

    @GetMapping("/sefaz/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> getSefazStatus() {
        try {
            log.info("Verificando status do SEFAZ");
            Map<String, String> status = fiscalDocumentService.getSEFAZStatus();
            log.info("Status SEFAZ consultado com sucesso");
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Erro ao verificar status do SEFAZ: {}", e.getMessage(), e);
            Map<String, String> fallback = Map.of(
                "connection", "OFFLINE",
                "service", "UNAVAILABLE",
                "lastUpdate", java.time.LocalDateTime.now().toString(),
                "environment", "UNKNOWN"
            );
            return ResponseEntity.ok(fallback);
        }
    }


}