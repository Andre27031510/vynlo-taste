package com.vynlotaste.entity.church;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade Ministry - Ministérios da Igreja (EKKLESIA)
 * ============================================================================
 * 
 * CONTEXTO: Ministérios como Louvor, Crianças, Jovens, etc
 * PRODUTO: EKKLESIA
 * SEGURANÇA: Multi-Tenancy com tenant_id
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Entity
@Table(name = "ministries", indexes = {
    @Index(name = "idx_ministries_tenant_id", columnList = "tenantId"),
    @Index(name = "idx_ministries_leader_id", columnList = "leaderId"),
    @Index(name = "idx_ministries_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ministry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    @NotBlank
    @Size(min = 2, max = 255)
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "leader_id")
    private Long leaderId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id", insertable = false, updatable = false)
    private Member leader;
    
    @NotBlank
    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}

