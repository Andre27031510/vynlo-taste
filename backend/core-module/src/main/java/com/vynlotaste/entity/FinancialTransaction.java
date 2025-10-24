package com.vynlotaste.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidade para transações financeiras
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@Entity
@Table(name = "financial_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description", length = 500, nullable = false)
    private String description;

    @Column(name = "amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private Type type;

    @Column(name = "category", length = 100, nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "recurring_info", columnDefinition = "TEXT")
    private String recurringInfo;

    @Column(name = "attachments", columnDefinition = "TEXT")
    @Builder.Default
    private String attachments = "[]";

    @Column(name = "tags", columnDefinition = "TEXT")
    @Builder.Default
    private String tags = "[]";

    @Column(name = "metadata", columnDefinition = "TEXT")
    @Builder.Default
    private String metadata = "{}";

    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "restaurant_id")
    private Long restaurantId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "tenant_id")
    private Long tenantId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "deleted_by")
    private Long deletedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /**
     * Tipos de transação financeira
     */
    public enum Type {
        INCOME("Receita"),
        EXPENSE("Despesa"),
        TRANSFER("Transferência"),
        ADJUSTMENT("Ajuste");

        private final String description;

        Type(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Status da transação financeira
     */
    public enum Status {
        PENDING("Pendente"),
        COMPLETED("Concluída"),
        CANCELLED("Cancelada"),
        FAILED("Falhou"),
        REFUNDED("Estornada");

        private final String description;

        Status(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
