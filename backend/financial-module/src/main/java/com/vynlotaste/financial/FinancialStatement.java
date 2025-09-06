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

@Entity
@Table(name = "financial_statements", 
       indexes = {
           @Index(name = "idx_statement_account", columnList = "account_id"),
           @Index(name = "idx_statement_period", columnList = "period_start, period_end"),
           @Index(name = "idx_statement_type", columnList = "type")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FinancialStatement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome do extrato é obrigatório")
    @Column(name = "name", nullable = false)
    private String name;
    
    @NotBlank(message = "Tipo do extrato é obrigatório")
    @Column(name = "type", nullable = false)
    private String type;
    
    @NotNull(message = "Data de início do período é obrigatória")
    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;
    
    @NotNull(message = "Data de fim do período é obrigatória")
    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;
    
    @Column(name = "opening_balance", precision = 19, scale = 2)
    private BigDecimal openingBalance;
    
    @Column(name = "closing_balance", precision = 19, scale = 2)
    private BigDecimal closingBalance;
    
    @Column(name = "total_income", precision = 19, scale = 2)
    private BigDecimal totalIncome;
    
    @Column(name = "total_expenses", precision = 19, scale = 2)
    private BigDecimal totalExpenses;
    
    @Column(name = "net_result", precision = 19, scale = 2)
    private BigDecimal netResult;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Relacionamento com FinancialAccount
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private FinancialAccount account;
}