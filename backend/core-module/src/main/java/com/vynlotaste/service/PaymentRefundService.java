package com.vynlotaste.service;

import com.vynlotaste.dto.PaymentRefundRequestDto;
import com.vynlotaste.dto.PaymentRefundResponseDto;
import com.vynlotaste.entity.PaymentRefund;
import com.vynlotaste.repository.PaymentRefundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// Modified: 2025-10-14 19:15 UTC | Real refunds service with BigDecimal import fix
// Modified: 2025-10-14 19:30 UTC | Final validation and comment added

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentRefundService {

    private final PaymentRefundRepository paymentRefundRepository;

    public Page<PaymentRefundResponseDto> getAllRefunds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        // MULTI-TENANCY: Filtrar por tenant_id
        Page<PaymentRefund> refunds;
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os estornos");
            refunds = paymentRefundRepository.findAll(pageable);
        } else {
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - retornando página vazia");
                return Page.empty(pageable);
            }
            log.debug("👤 Cliente (tenant_id={}): retornando estornos do tenant", tenantId);
            refunds = paymentRefundRepository.findAllByTenantId(tenantId, pageable);
        }
        
        return refunds.map(PaymentRefundResponseDto::new);
    }

    public Page<PaymentRefundResponseDto> getRefundsByStatus(PaymentRefund.RefundStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentRefund> refunds = paymentRefundRepository.findByStatus(status, pageable);
        return refunds.map(PaymentRefundResponseDto::new);
    }

    @Transactional
    public PaymentRefundResponseDto createRefund(PaymentRefundRequestDto request) {
        log.info("📝 Criando solicitação de estorno: paymentId={}, amount={}", request.getPaymentId(), request.getAmount());
        
        PaymentRefund refund = new PaymentRefund();
        refund.setPaymentId(request.getPaymentId());
        refund.setAmount(request.getAmount());
        refund.setReason(request.getReason());
        refund.setNotes(request.getNotes());
        refund.setStatus(PaymentRefund.RefundStatus.PENDING);
        
        // MULTI-TENANCY: Setar tenant_id automaticamente
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        refund.setTenantId(tenantId);
        log.debug("🔒 PaymentRefund será criado com tenant_id={}", tenantId);
        
        PaymentRefund savedRefund = paymentRefundRepository.save(refund);
        log.info("✅ Solicitação de estorno criada: ID={}", savedRefund.getId());
        
        return new PaymentRefundResponseDto(savedRefund);
    }

    @Transactional
    public PaymentRefundResponseDto updateRefundStatus(Long id, PaymentRefund.RefundStatus status, String processedBy) {
        log.info("📝 Atualizando status do estorno: ID={}, status={}", id, status);
        
        PaymentRefund refund = paymentRefundRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Estorno não encontrado: " + id));
        
        refund.setStatus(status);
        refund.setProcessedBy(processedBy);
        refund.setProcessedAt(LocalDateTime.now());
        
        PaymentRefund savedRefund = paymentRefundRepository.save(refund);
        log.info("✅ Status do estorno atualizado: ID={}, status={}", savedRefund.getId(), savedRefund.getStatus());
        
        return new PaymentRefundResponseDto(savedRefund);
    }

    public PaymentRefundResponseDto getRefundById(Long id) {
        PaymentRefund refund = paymentRefundRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Estorno não encontrado: " + id));
        return new PaymentRefundResponseDto(refund);
    }

    @Transactional
    public void deleteRefund(Long id) {
        log.info("🗑️ Deletando estorno: ID={}", id);
        paymentRefundRepository.deleteById(id);
        log.info("✅ Estorno deletado: ID={}", id);
    }

    public Map<String, Object> getRefundStats() {
        try {
            long pendingRefunds = paymentRefundRepository.countByStatus(PaymentRefund.RefundStatus.PENDING);
            long inAnalysisRefunds = paymentRefundRepository.countByStatus(PaymentRefund.RefundStatus.IN_ANALYSIS);
            long approvedRefunds = paymentRefundRepository.countByStatus(PaymentRefund.RefundStatus.APPROVED);
            long processedRefunds = paymentRefundRepository.countByStatus(PaymentRefund.RefundStatus.PROCESSED);
            
            // Total estornado nos últimos 30 dias
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            BigDecimal totalRefunded = paymentRefundRepository.sumProcessedAmountSince(thirtyDaysAgo);
            if (totalRefunded == null) {
                totalRefunded = BigDecimal.ZERO;
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("pending", pendingRefunds);
            stats.put("inAnalysis", inAnalysisRefunds);
            stats.put("approved", approvedRefunds);
            stats.put("processed", processedRefunds);
            stats.put("totalRefunded", totalRefunded);
            
            return stats;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estatísticas de estornos: {}", e.getMessage(), e);
            // Retornar stats zerados em caso de erro
            Map<String, Object> emptyStats = new HashMap<>();
            emptyStats.put("pending", 0);
            emptyStats.put("inAnalysis", 0);
            emptyStats.put("approved", 0);
            emptyStats.put("processed", 0);
            emptyStats.put("totalRefunded", BigDecimal.ZERO);
            return emptyStats;
        }
    }
}
