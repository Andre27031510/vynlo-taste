package com.vynlotaste.entity.church;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade Tithing - Dízimos e Ofertas (EKKLESIA)
 * ============================================================================
 */
@Entity
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Table(name = "tithings", indexes = {
    @Index(name = "idx_tithings_tenant_id", columnList = "tenantId"),
    @Index(name = "idx_tithings_member_id", columnList = "memberId"),
    @Index(name = "idx_tithings_payment_date", columnList = "paymentDate"),
    @Index(name = "idx_tithings_tithe_type", columnList = "titheType")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tithing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    @Column(name = "member_id")
    private Long memberId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;
    
    @NotNull
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @NotBlank
    @Column(name = "tithe_type", nullable = false, length = 50)
    private String titheType; // TITHE, OFFERING, DONATION, SPECIAL
    
    @NotBlank
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // CASH, PIX, BANK_TRANSFER, CHECK, CREDIT_CARD
    
    @NotNull
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate = LocalDate.now();
    
    @Size(max = 100)
    @Column(name = "reference_number", length = 100)
    private String referenceNumber;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "recorded_by")
    private Long recordedBy; // ID do usuário que registrou
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}

