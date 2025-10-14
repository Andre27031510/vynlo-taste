package com.vynlotaste.controller;

import com.vynlotaste.dto.PaymentResponseDto;
import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.entity.Payment;
import com.vynlotaste.mapper.PaymentMapper;
import com.vynlotaste.service.PaymentService;
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
@RequestMapping("/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    // v2.1.2 - POSTs agora chamam services reais (não mock)
    // Modified: 2025-10-11-v27

    private final PaymentService paymentService;
    private final PaymentMapper paymentMapper;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponseDto<PaymentResponseDto>> getPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            log.info("Buscando pagamentos - página: {}, tamanho: {}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<Payment> payments = paymentService.findAll(pageable);
            List<PaymentResponseDto> response = payments.stream()
                .map(paymentMapper::toResponseDto)
                .toList();
            log.info("Pagamentos encontrados: {}", response.size());
            return ResponseEntity.ok(PagedResponseDto.of(response, page, size, payments.getTotalElements()));
        } catch (Exception e) {
            log.error("Erro ao buscar pagamentos: {}", e.getMessage(), e);
            PagedResponseDto<PaymentResponseDto> fallback = PagedResponseDto.of(
                Collections.emptyList(), page, size, 0L
            );
            return ResponseEntity.ok(fallback);
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDto> createPayment(@RequestBody PaymentService.PaymentRequestDto request) {
        try {
            log.info("Criando novo pagamento - método: {}, valor: {}", request.getMethod(), request.getAmount());
            Payment payment = paymentService.createPayment(request);
            PaymentResponseDto response = paymentMapper.toResponseDto(payment);
            log.info("✅ Pagamento criado: ID={}, método={}", payment.getId(), payment.getMethod());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Erro ao criar pagamento: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao criar pagamento: " + e.getMessage(), e);
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDto> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            log.info("Atualizando pagamento ID: {} para status: {}", id, status);
            Payment payment = paymentService.updateStatus(id, status);
            PaymentResponseDto response = paymentMapper.toResponseDto(payment);
            log.info("✅ Pagamento atualizado: ID={}, status={}", payment.getId(), payment.getStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar pagamento: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao atualizar pagamento: " + e.getMessage(), e);
        }
    }

    @GetMapping("/providers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getPaymentProviders() {
        try {
            log.info("Buscando provedores de pagamento");
            List<String> providers = paymentService.getProviders();
            log.info("Provedores encontrados: {}", providers.size());
            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            log.error("Erro ao buscar provedores de pagamento: {}", e.getMessage(), e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getPaymentStats() {
        try {
            log.info("Buscando estatísticas de pagamento");
            Map<String, Object> stats = paymentService.getStats();
            log.info("Estatísticas calculadas com sucesso");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Erro ao buscar estatísticas de pagamento: {}", e.getMessage(), e);
            Map<String, Object> fallback = Map.of(
                "total", 0,
                "approved", 0,
                "failed", 0,
                "pending", 0,
                "successRate", 0.0
            );
            return ResponseEntity.ok(fallback);
        }
    }


}