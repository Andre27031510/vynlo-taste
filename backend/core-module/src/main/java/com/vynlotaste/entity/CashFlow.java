package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing cash flow entries
 * Used for cash flow management and financial reporting
 */
@Entity
@Table(name = "cash_flow", indexes = {
    @Index(name = "idx_cash_flow_type", columnList = "type"),
    @Index(name = "idx_cash_flow_status", columnList = "status"),
    @Index(name = "idx_cash_flow_date", columnList = "date"),
    @Index(name = "idx_cash_flow_user", columnList = "user_id"),
    @Index(name = "idx_cash_flow_category", columnList = "category")
})
public class CashFlow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tipo é obrigatório")
    @Pattern(regexp = "^(INCOME|EXPENSE)$", message = "Tipo deve ser INCOME ou EXPENSE")
    @Column(nullable = false, length = 10)
    private String type;

    @NotBlank(message = "Categoria é obrigatória")
    @Size(min = 2, max = 100, message = "Categoria deve ter entre 2 e 100 caracteres")
    @Column(nullable = false, length = 100)
    private String category;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 3, max = 500, message = "Descrição deve ter entre 3 e 500 caracteres")
    @Column(nullable = false, length = 500)
    private String description;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999.99", message = "Valor deve ser menor que R$ 999.999,99")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Data é obrigatória")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Status é obrigatório")
    @Pattern(regexp = "^(CONFIRMED|PENDING|CANCELLED)$", message = "Status deve ser CONFIRMED, PENDING ou CANCELLED")
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Multi-Tenancy: ID do tenant (restaurante/empresa) dono deste fluxo de caixa
     * NULL = Super Admin (acesso global)
     * NOT NULL = Cliente específico (fluxo de caixa isolado)
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
    public boolean isIncome() {
        return "INCOME".equals(type);
    }

    public boolean isExpense() {
        return "EXPENSE".equals(type);
    }

    public boolean isConfirmed() {
        return "CONFIRMED".equals(status);
    }

    public boolean isPending() {
        return "PENDING".equals(status);
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(status);
    }

    public BigDecimal getSignedAmount() {
        return isIncome() ? amount : amount.negate();
    }

    // Construtores
    public CashFlow() {}

    public CashFlow(String type, String category, String description, BigDecimal amount, LocalDate date, User user) {
        this.type = type;
        this.category = category;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.user = user;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }
}