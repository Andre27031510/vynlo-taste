package com.vynlotaste.controller;

import com.vynlotaste.dto.PaymentRefundRequestDto;
import com.vynlotaste.dto.PaymentRefundResponseDto;
import com.vynlotaste.entity.PaymentRefund;
import com.vynlotaste.service.PaymentRefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/payments/refunds")
@RequiredArgsConstructor
public class PaymentRefundController {

    private final PaymentRefundService paymentRefundService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<PaymentRefundResponseDto>> getAllRefunds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<PaymentRefundResponseDto> refunds = paymentRefundService.getAllRefunds(page, size);
            return ResponseEntity.ok(refunds);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estornos: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<PaymentRefundResponseDto>> getRefundsByStatus(
            @PathVariable PaymentRefund.RefundStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<PaymentRefundResponseDto> refunds = paymentRefundService.getRefundsByStatus(status, page, size);
            return ResponseEntity.ok(refunds);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estornos por status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentRefundResponseDto> createRefund(@Valid @RequestBody PaymentRefundRequestDto request) {
        try {
            log.info("📝 Criando solicitação de estorno: paymentId={}", request.getPaymentId());
            PaymentRefundResponseDto refund = paymentRefundService.createRefund(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(refund);
        } catch (Exception e) {
            log.error("❌ Erro ao criar estorno: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentRefundResponseDto> updateRefundStatus(
            @PathVariable Long id,
            @RequestParam PaymentRefund.RefundStatus status,
            @RequestParam(defaultValue = "system") String processedBy) {
        try {
            log.info("📝 Atualizando status do estorno: ID={}, status={}", id, status);
            PaymentRefundResponseDto refund = paymentRefundService.updateRefundStatus(id, status, processedBy);
            return ResponseEntity.ok(refund);
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar status do estorno: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentRefundResponseDto> getRefundById(@PathVariable Long id) {
        try {
            PaymentRefundResponseDto refund = paymentRefundService.getRefundById(id);
            return ResponseEntity.ok(refund);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estorno: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteRefund(@PathVariable Long id) {
        try {
            paymentRefundService.deleteRefund(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("❌ Erro ao deletar estorno: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getRefundStats() {
        try {
            Map<String, Object> stats = paymentRefundService.getRefundStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estatísticas de estornos: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
