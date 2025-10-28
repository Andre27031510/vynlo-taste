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
 * Entidade Church - Igrejas (EKKLESIA)
 * ============================================================================
 * 
 * CONTEXTO: Sistema para gestão de igrejas
 * PRODUTO: EKKLESIA
 * SEGURANÇA: Multi-Tenancy com tenant_id (Row-Level)
 * 
 * ESTRUTURA ECLESIÁSTICA:
 * - Central, Estadual, Setorial (Porte)
 * - Cidade/Região
 * - Pastor e Financeira responsáveis
 * 
 * MIGRATION: V22__Create_churches_table.sql
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Entity
@Table(name = "churches", indexes = {
    @Index(name = "idx_churches_tenant_id", columnList = "tenantId"),
    @Index(name = "idx_churches_porte", columnList = "porte"),
    @Index(name = "idx_churches_cidade", columnList = "cidade"),
    @Index(name = "idx_churches_totvs", columnList = "totvs")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Church {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 🏛️ MULTI-TENANCY: Isolamento de dados
     * Igreja X não vê dados de Igreja Y
     */
    @NotNull(message = "Tenant ID é obrigatório")
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    // ========== IDENTIFICAÇÃO DA IGREJA ==========
    
    /**
     * EXEMPLO: "Central", "Estadual", "Setorial"
     */
    @NotBlank(message = "Porte é obrigatório")
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String porte;
    
    /**
     * EXEMPLO: "Londrina", "Maringá", "Paiçandu"
     */
    @NotBlank(message = "Cidade é obrigatória")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String cidade;
    
    /**
     * EXEMPLO: "Estadual Londrina" (porte + cidade)
     */
    @NotBlank(message = "Nome da igreja é obrigatório")
    @Size(max = 200)
    @Column(name = "nome_igreja", nullable = false, length = 200)
    private String nomeIgreja;
    
    /**
     * TOTVS - Número de matrícula da igreja
     */
    @Size(max = 50)
    @Column(unique = true, length = 50)
    private String totvs;
    
    // ========== PASTOR ==========
    
    @NotBlank(message = "Nome do pastor é obrigatório")
    @Size(max = 255)
    @Column(name = "pastor_nome", nullable = false, length = 255)
    private String pastorNome;
    
    @Size(max = 20)
    @Column(name = "pastor_telefone", length = 20)
    private String pastorTelefone;
    
    // ========== FINANCEIRA ==========
    
    @NotBlank(message = "Nome da financeira é obrigatório")
    @Size(max = 255)
    @Column(name = "financeira_nome", nullable = false, length = 255)
    private String financeiraNome;
    
    @Size(max = 20)
    @Column(name = "financeira_telefone", length = 20)
    private String financeiraTelefone;
    
    // ========== ENDEREÇO ==========
    
    @Column(columnDefinition = "TEXT")
    private String endereco;
    
    // ========== STATUS ==========
    
    @NotBlank
    @Column(nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, TRANSFERRED
    
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
}

