package com.vynlotaste.dto;

import com.vynlotaste.entity.PaymentRefund;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Created: 2025-10-14 19:00 UTC | Real refunds response DTO
// Modified: 2025-10-14 19:30 UTC | Final validation and comment added

@Data
public class PaymentRefundResponseDto {

    private Long id;
    private Long paymentId;
    private BigDecimal amount;
    private String reason;
    private PaymentRefund.RefundStatus status;
    private String statusDisplayName;
    private String notes;
    private LocalDateTime processedAt;
    private String processedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentRefundResponseDto() {}

    public PaymentRefundResponseDto(PaymentRefund refund) {
        this.id = refund.getId();
        this.paymentId = refund.getPaymentId();
        this.amount = refund.getAmount();
        this.reason = refund.getReason();
        this.status = refund.getStatus();
        this.statusDisplayName = refund.getStatus().getDisplayName();
        this.notes = refund.getNotes();
        this.processedAt = refund.getProcessedAt();
        this.processedBy = refund.getProcessedBy();
        this.createdAt = refund.getCreatedAt();
        this.updatedAt = refund.getUpdatedAt();
    }
}
