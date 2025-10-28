package com.vynlotaste.entity.church;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade Member - Membros da Igreja (EKKLESIA)
 * ============================================================================
 * 
 * CONTEXTO: Sistema para gestão de membros de igrejas
 * PRODUTO: EKKLESIA
 * SEGURANÇA: Multi-Tenancy com tenant_id (Row-Level)
 * 
 * ISOLAMENTO:
 * - Member de Igreja X não vê dados de Igreja Y
 * - Super Admin vê TODOS os membros
 * 
 * MIGRATION: V20__Create_ekklesia_tables.sql
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Entity
@Table(name = "members", indexes = {
    @Index(name = "idx_members_tenant_id", columnList = "tenantId"),
    @Index(name = "idx_members_cell_group_id", columnList = "cellGroupId"),
    @Index(name = "idx_members_ministry_id", columnList = "ministryId"),
    @Index(name = "idx_members_status", columnList = "status"),
    @Index(name = "idx_members_join_date", columnList = "joinDate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 🏛️ MULTI-TENANCY: Isolamento de dados
     * Igreja X não vê membros de Igreja Y
     */
    @NotNull(message = "Tenant ID é obrigatório")
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    // ========== DADOS PESSOAIS ==========
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 255)
    @Column(nullable = false, length = 255)
    private String name;
    
    @Email(message = "Email inválido")
    @Column(unique = true)
    private String email;
    
    @Pattern(regexp = "^[\\d\\s\\-\\+()]+$", message = "Telefone inválido")
    @Column(length = 20)
    private String phone;
    
    @Past(message = "Data de nascimento deve ser no passado")
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Past(message = "Data de batismo deve ser no passado")
    @Column(name = "baptism_date")
    private LocalDate baptismDate;
    
    @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$|^$", message = "CPF inválido")
    @Column(unique = true, length = 14)
    private String cpf;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    // ========== DADOS ECLESIÁSTICOS ==========
    
    @NotNull
    @PastOrPresent(message = "Data de ingresso deve ser no passado ou presente")
    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate = LocalDate.now();
    
    @NotBlank
    @Column(name = "spiritual_status", nullable = false, length = 50)
    private String spiritualStatus = "NEW_BELIEVER"; // NEW_BELIEVER, GROWING, MATURE, LEADER
    
    @NotBlank
    @Column(nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, TRANSFERRED, VISITOR
    
    // ========== RELACIONAMENTOS ==========
    
    @Column(name = "cell_group_id")
    private Long cellGroupId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cell_group_id", insertable = false, updatable = false)
    private CellGroup cellGroup;
    
    @Column(name = "ministry_id")
    private Long ministryId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ministry_id", insertable = false, updatable = false)
    private Ministry ministry;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    // ========== METADATA ==========
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    // ========== RELACIONAMENTOS INVERSOS ==========
    
    // Tithings (One-to-Many)
    // Event Attendance (Many-to-Many via event_attendance table)
    // Ministry Members (Many-to-Many via ministry_members table)
}

