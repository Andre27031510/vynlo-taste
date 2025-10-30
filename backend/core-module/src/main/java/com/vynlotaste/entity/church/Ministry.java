package com.vynlotaste.entity.church;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade Ministry - Departamentos das Igrejas (EKKLESIA)
 * ============================================================================
 * 
 * CONTEXTO: Departamentos vinculados a igrejas (Jovens, Infantil, Social, etc)
 * PRODUTO: EKKLESIA
 * SEGURANÇA: Multi-Tenancy com tenant_id
 * 
 * @version 2.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Entity
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Table(name = "departments", indexes = {
    @Index(name = "idx_ministries_tenant_id", columnList = "tenantId"),
    @Index(name = "idx_ministries_church_id", columnList = "churchId"),
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
    
    @NotNull
    @Column(name = "church_id", nullable = false)
    private Long churchId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "church_id", insertable = false, updatable = false)
    private Church church;
    
    @NotBlank
    @Size(min = 2, max = 100)
    @Column(nullable = false, length = 100)
    private String departmentType; // JOVENS, INFANTIL, SOCIAL, ADOLESCENTES, etc
    
    @Size(max = 255)
    @Column(name = "leader_name")
    private String leaderName;
    
    @Size(max = 20)
    @Column(name = "leader_phone")
    private String leaderPhone;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
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

