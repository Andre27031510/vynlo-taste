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
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.math.RoundingMode;
import jakarta.validation.constraints.Size;

/**
 * Entidade para gerenciar contas financeiras do sistema Vynlo Taste
 * Suporta múltiplos tipos de conta e categorizações
 */
@Entity
@Table(name = "financial_accounts", 
       indexes = {
           @Index(name = "idx_financial_account_name", columnList = "name"),
           @Index(name = "idx_financial_account_type", columnList = "type"),
           @Index(name = "idx_financial_account_status", columnList = "status"),
           @Index(name = "idx_financial_account_restaurant", columnList = "restaurant_id")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FinancialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome da conta é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Código da conta é obrigatório")
    @Size(min = 3, max = 20, message = "Código deve ter entre 3 e 20 caracteres")
    @Column(name = "account_code", unique = true, nullable = false)
    private String accountCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AccountType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private AccountCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AccountStatus status;

    @NotNull(message = "Saldo inicial é obrigatório")
    @Column(name = "initial_balance", nullable = false, precision = 19, scale = 2)
    private BigDecimal initialBalance;

    @Column(name = "current_balance", nullable = false, precision = 19, scale = 2)
    private BigDecimal currentBalance;

    @Column(name = "credit_limit", precision = 19, scale = 2)
    private BigDecimal creditLimit;

    @Column(name = "available_credit", precision = 19, scale = 2)
    private BigDecimal availableCredit;

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    @Column(name = "overdraft_fee")
    private BigDecimal overdraftFee;

    @Column(name = "monthly_fee")
    private BigDecimal monthlyFee;

    @Column(name = "annual_fee")
    private BigDecimal annualFee;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_agency")
    private String bankAgency;

    @Column(name = "bank_account")
    private String bankAccount;

    @Column(name = "bank_account_type")
    private String bankAccountType;

    @Column(name = "pix_key")
    private String pixKey;

    @Column(name = "pix_key_type")
    private String pixKeyType;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "card_type")
    private String cardType;

    @Column(name = "card_holder")
    private String cardHolder;

    @Column(name = "card_expiry")
    private String cardExpiry;

    @Column(name = "card_cvv")
    private String cardCvv;

    @Column(name = "due_date")
    private Integer dueDate; // Dia do vencimento (1-31)

    @Column(name = "closing_date")
    private Integer closingDate; // Dia de fechamento (1-31)

    @Column(name = "payment_methods", columnDefinition = "TEXT")
    private String paymentMethods; // JSON array de métodos de pagamento aceitos

    @Column(name = "settings", columnDefinition = "TEXT")
    private String settings; // JSON com configurações específicas da conta

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

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
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FinancialTransaction> transactions = new HashSet<>();

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FinancialStatement> statements = new HashSet<>();

    // Métodos de negócio
    public void updateBalance(BigDecimal amount) {
        this.currentBalance = this.currentBalance.add(amount);
    }

    public boolean hasSufficientFunds(BigDecimal amount) {
        return this.currentBalance.compareTo(amount) >= 0;
    }

    public boolean isOverdraft() {
        return this.currentBalance.compareTo(BigDecimal.ZERO) < 0;
    }

    public BigDecimal getAvailableBalance() {
        if (this.type == AccountType.CREDIT) {
            return this.creditLimit.add(this.currentBalance);
        }
        return this.currentBalance;
    }

    public boolean isCreditCard() {
        return this.type == AccountType.CREDIT && this.cardNumber != null;
    }

    public boolean isBankAccount() {
        return this.bankName != null && this.bankAccount != null;
    }

    public boolean isPixEnabled() {
        return this.pixKey != null && this.pixKeyType != null;
    }

    public void calculateInterest() {
        if (this.interestRate != null && this.currentBalance.compareTo(BigDecimal.ZERO) < 0) {
            BigDecimal interest = this.currentBalance.abs()
                .multiply(this.interestRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            this.currentBalance = this.currentBalance.subtract(interest);
        }
    }

    // Enums
    public enum AccountType {
        CHECKING, SAVINGS, CREDIT, INVESTMENT, CASH, DIGITAL_WALLET, LOAN, OTHER
    }

    public enum AccountCategory {
        ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    }

    public enum AccountStatus {
        ACTIVE, INACTIVE, SUSPENDED, CLOSED, PENDING_APPROVAL
    }
}
