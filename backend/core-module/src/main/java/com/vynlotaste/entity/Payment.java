package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing payment transactions
 * Used for payment processing and tracking
 */
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_status", columnList = "status"),
    @Index(name = "idx_payment_method", columnList = "method"),
    @Index(name = "idx_payment_order", columnList = "order_id"),
    @Index(name = "idx_payment_transaction_id", columnList = "transaction_id"),
    @Index(name = "idx_payment_created_at", columnList = "created_at")
})
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999.99", message = "Valor deve ser menor que R$ 999.999,99")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank(message = "Método de pagamento é obrigatório")
    @Pattern(regexp = "^(CREDIT_CARD|DEBIT|PIX|CASH)$", message = "Método deve ser CREDIT_CARD, DEBIT, PIX ou CASH")
    @Column(nullable = false, length = 20)
    private String method;

    @Size(max = 50, message = "Provedor deve ter no máximo 50 caracteres")
    @Column(length = 50)
    private String provider;

    @NotBlank(message = "Status é obrigatório")
    @Pattern(regexp = "^(PENDING|APPROVED|FAILED|REFUNDED)$", message = "Status deve ser PENDING, APPROVED, FAILED ou REFUNDED")
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @Size(max = 200, message = "ID da transação deve ter no máximo 200 caracteres")
    @Column(name = "transaction_id", length = 200)
    private String transactionId;

    @Size(max = 2000, message = "Metadata deve ter no máximo 2000 caracteres")
    @Column(columnDefinition = "TEXT")
    private String metadata;

    /**
     * Multi-Tenancy: ID do tenant (restaurante/empresa) dono deste pagamento
     * NULL = Super Admin (acesso global)
     * NOT NULL = Cliente específico (pagamentos isolados)
     */
    @Column(name = "tenant_id")
    private Long tenantId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Métodos de negócio
    public boolean isPending() {
        return "PENDING".equals(status);
    }

    public boolean isApproved() {
        return "APPROVED".equals(status);
    }

    public boolean isFailed() {
        return "FAILED".equals(status);
    }

    public boolean isRefunded() {
        return "REFUNDED".equals(status);
    }

    public boolean isCreditCard() {
        return "CREDIT_CARD".equals(method);
    }

    public boolean isPix() {
        return "PIX".equals(method);
    }

    // Construtores
    public Payment() {}

    public Payment(BigDecimal amount, String method, String status) {
        this.amount = amount;
        this.method = method;
        this.status = status;
    }

    public Payment(Order order, BigDecimal amount, String method, String provider) {
        this.order = order;
        this.amount = amount;
        this.method = method;
        this.provider = provider;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }
}