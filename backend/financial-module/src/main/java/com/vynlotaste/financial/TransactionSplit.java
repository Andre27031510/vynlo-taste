package com.vynlotaste.financial;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "transaction_splits", 
       indexes = {
           @Index(name = "idx_split_transaction", columnList = "transaction_id")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionSplit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Valor do rateio é obrigatório")
    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "percentage")
    private BigDecimal percentage;
    
    // Relacionamento com FinancialTransaction
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private FinancialTransaction transaction;
}