package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing financial transactions (income/expense)
 * Used for financial management and reporting
 */
@Entity
@Table(name = "financial_transactions", indexes = {
    @Index(name = "idx_financial_type", columnList = "type"),
    @Index(name = "idx_financial_status", columnList = "status"),
    @Index(name = "idx_financial_date", columnList = "date"),
    @Index(name = "idx_financial_user", columnList = "user_id"),
    @Index(name = "idx_financial_category", columnList = "category")
})
public class Financial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tipo da transação é obrigatório")
    @Pattern(regexp = "^(INCOME|EXPENSE)$", message = "Tipo deve ser INCOME ou EXPENSE")
    @Column(nullable = false, length = 10)
    private String type;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999.99", message = "Valor deve ser menor que R$ 999.999,99")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 3, max = 500, message = "Descrição deve ter entre 3 e 500 caracteres")
    @Column(nullable = false, length = 500)
    private String description;

    @NotBlank(message = "Categoria é obrigatória")
    @Size(min = 2, max = 100, message = "Categoria deve ter entre 2 e 100 caracteres")
    @Column(nullable = false, length = 100)
    private String category;

    @NotNull(message = "Data é obrigatória")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Status é obrigatório")
    @Pattern(regexp = "^(PENDING|CONFIRMED|CANCELLED)$", message = "Status deve ser PENDING, CONFIRMED ou CANCELLED")
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

    public boolean isPending() {
        return "PENDING".equals(status);
    }

    public boolean isConfirmed() {
        return "CONFIRMED".equals(status);
    }

    // Construtores
    public Financial() {}

    public Financial(String type, BigDecimal amount, String description, String category, LocalDate date, User user) {
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.category = category;
        this.date = date;
        this.user = user;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

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
}