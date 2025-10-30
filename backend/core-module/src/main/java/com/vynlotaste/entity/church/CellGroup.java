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
import java.time.LocalTime;

/**
 * ============================================================================
 * Entidade CellGroup - Grupos de Células (EKKLESIA)
 * ============================================================================
 */
@Entity
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Table(name = "cell_groups", indexes = {
    @Index(name = "idx_cell_groups_tenant_id", columnList = "tenantId"),
    @Index(name = "idx_cell_groups_leader_id", columnList = "leaderId"),
    @Index(name = "idx_cell_groups_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CellGroup {
    
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
    
    @Column(name = "leader_id")
    private Long leaderId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id", insertable = false, updatable = false)
    private Member leader;
    
    @Size(max = 255)
    private String location;
    
    @Column(name = "day_of_week", length = 20)
    private String dayOfWeek;
    
    @Column(name = "time")
    private LocalTime time;
    
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

