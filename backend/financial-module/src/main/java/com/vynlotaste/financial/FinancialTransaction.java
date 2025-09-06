package com.vynlotaste.financial;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidade para gerenciar transações financeiras do sistema Vynlo Taste
 * Suporta múltiplos tipos de transação e categorizações
 */
@Entity
@Table(name = "financial_transactions", 
       indexes = {
           @Index(name = "idx_transaction_date", columnList = "transaction_date"),
           @Index(name = "idx_transaction_type", columnList = "type"),
           @Index(name = "idx_transaction_category", columnList = "category"),
           @Index(name = "idx_transaction_status", columnList = "status"),
           @Index(name = "idx_transaction_account", columnList = "account_id"),
           @Index(name = "idx_transaction_restaurant", columnList = "restaurant_id")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FinancialTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Descrição da transação é obrigatória")
    @jakarta.validation.constraints.Size(min = 3, max = 200, message = "Descrição deve ter entre 3 e 200 caracteres")
    @Column(name = "description", nullable = false)
    private String description;

    @jakarta.validation.constraints.Size(max = 500, message = "Observações devem ter no máximo 500 caracteres")
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @NotNull(message = "Valor da transação é obrigatório")
    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Tipo da transação é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    @NotNull(message = "Categoria da transação é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private TransactionCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;

    @NotNull(message = "Data da transação é obrigatória")
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "reference_number")
    private String referenceNumber;

    @Column(name = "external_reference")
    private String externalReference;

    @Column(name = "check_number")
    private String checkNumber;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "receipt_number")
    private String receiptNumber;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_provider")
    private String paymentProvider;

    @Column(name = "transaction_fee")
    private BigDecimal transactionFee;

    @Column(name = "tax_amount")
    private BigDecimal taxAmount;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    @Column(name = "exchange_rate")
    private BigDecimal exchangeRate;

    @Column(name = "original_currency")
    private String originalCurrency;

    @Column(name = "original_amount")
    private BigDecimal originalAmount;

    @Column(name = "recurring")
    private Boolean recurring;

    @Column(name = "recurrence_pattern")
    private String recurrencePattern; // JSON com padrão de recorrência

    @Column(name = "next_recurrence_date")
    private LocalDate nextRecurrenceDate;

    @Column(name = "attachments", columnDefinition = "TEXT")
    private String attachments; // JSON array de URLs de anexos

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON array de tags

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON com metadados adicionais

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private Long deletedBy;

    @Column(name = "active", nullable = false)
    private Boolean active;

    // Relacionamentos
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private FinancialAccount account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TransactionSplit> splits = new HashSet<>();

    // Métodos de negócio
    public boolean isIncome() {
        return this.type == TransactionType.INCOME;
    }

    public boolean isExpense() {
        return this.type == TransactionType.EXPENSE;
    }

    public boolean isTransfer() {
        return this.type == TransactionType.TRANSFER;
    }

    public boolean isPending() {
        return this.status == TransactionStatus.PENDING;
    }

    public boolean isCompleted() {
        return this.status == TransactionStatus.COMPLETED;
    }

    public boolean isCancelled() {
        return this.status == TransactionStatus.CANCELLED;
    }

    public boolean isOverdue() {
        return this.dueDate != null && this.dueDate.isBefore(LocalDate.now()) && this.status == TransactionStatus.PENDING;
    }

    public BigDecimal getNetAmount() {
        BigDecimal netAmount = this.amount;
        if (this.transactionFee != null) {
            netAmount = netAmount.subtract(this.transactionFee);
        }
        if (this.taxAmount != null) {
            netAmount = netAmount.subtract(this.taxAmount);
        }
        if (this.discountAmount != null) {
            netAmount = netAmount.add(this.discountAmount);
        }
        return netAmount;
    }

    public void markAsPaid() {
        this.status = TransactionStatus.COMPLETED;
        this.paymentDate = LocalDate.now();
    }

    public void markAsCancelled() {
        this.status = TransactionStatus.CANCELLED;
    }

    public boolean isRecurring() {
        return this.recurring != null && this.recurring;
    }

    // Enums
    public enum TransactionType {
        INCOME, EXPENSE, TRANSFER, ADJUSTMENT, REFUND, CHARGEBACK
    }

    public enum TransactionCategory {
        // Receitas
        SALES, DELIVERY_FEE, TIPS, REFUNDS, INTEREST, INVESTMENT_RETURN, OTHER_INCOME,
        
        // Despesas
        FOOD_COST, LABOR_COST, RENT, UTILITIES, INSURANCE, MARKETING, MAINTENANCE,
        EQUIPMENT, SUPPLIES, LICENSES, TAXES, FEES, LOAN_PAYMENT, CREDIT_CARD_PAYMENT,
        
        // Transferências
        BANK_TRANSFER, CASH_DEPOSIT, CASH_WITHDRAWAL, ACCOUNT_TRANSFER,
        
        // Ajustes
        CORRECTION, WRITE_OFF, GAIN_LOSS, EXCHANGE_RATE_DIFFERENCE
    }

    public enum TransactionStatus {
        PENDING, COMPLETED, CANCELLED, FAILED, PARTIALLY_PAID, OVERDUE
    }
}
