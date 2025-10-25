package com.vynlotaste.dto.financial;

import com.vynlotaste.entity.FinancialTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para transações financeiras
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialTransactionDto {

    private Long id;
    private String description;
    private BigDecimal amount;
    private FinancialTransaction.Type type;
    private String category;
    private FinancialTransaction.Status status;
    private LocalDate transactionDate;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private String referenceNumber;
    private String paymentMethod;
    private String recurringInfo;
    private String attachments;
    private String tags;
    private String metadata;
    private Long accountId;
    private Long restaurantId;
    private Long orderId;
    private Long customerId;
    private Long supplierId;
    private Long tenantId;
    private Long userId; // ✅ Campo obrigatório para compliance LGPD e auditoria
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;

    /**
     * DTO para criação de transação financeira
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String description;
        private BigDecimal amount;
        private FinancialTransaction.Type type;
        private String category;
        private LocalDate transactionDate;
        private LocalDate dueDate;
        private String referenceNumber;
        private String paymentMethod;
        private String recurringInfo;
        private String attachments;
        private String tags;
        private String metadata;
        private Long accountId;
        private Long restaurantId;
        private Long orderId;
        private Long customerId;
        private Long supplierId;
        private Long userId;
    }

    /**
     * DTO para atualização de transação financeira
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String description;
        private BigDecimal amount;
        private FinancialTransaction.Type type;
        private String category;
        private FinancialTransaction.Status status;
        private LocalDate transactionDate;
        private LocalDate dueDate;
        private LocalDate paymentDate;
        private String referenceNumber;
        private String paymentMethod;
        private String recurringInfo;
        private String attachments;
        private String tags;
        private String metadata;
        private Long accountId;
        private Long restaurantId;
        private Long orderId;
        private Long customerId;
        private Long supplierId;
        private Long userId;
    }

    /**
     * DTO para resposta de transação financeira
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String description;
        private BigDecimal amount;
        private FinancialTransaction.Type type;
        private String category;
        private FinancialTransaction.Status status;
        private LocalDate transactionDate;
        private LocalDate dueDate;
        private LocalDate paymentDate;
        private String referenceNumber;
        private String paymentMethod;
        private String recurringInfo;
        private String attachments;
        private String tags;
        private String metadata;
        private Long accountId;
        private Long restaurantId;
        private Long orderId;
        private Long customerId;
        private Long supplierId;
        private Long tenantId;
        private Long userId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long createdBy;
        private Long updatedBy;
    }
}
