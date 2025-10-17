package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade Tenant - Multi-Tenancy (Isolamento de Dados)
 * ============================================================================
 * 
 * CONTEXTO: Cada tenant representa um cliente (Restaurante, Igreja, Clínica, etc)
 * OBJETIVO: Isolar dados entre clientes (Admin Restaurant X NÃO vê dados Restaurant Y)
 * ESTRATÉGIA: Row-Level Multi-Tenancy com tenant_id em todas as tabelas
 * 
 * RELACIONAMENTOS:
 * - Um tenant tem N produtos (products.tenant_id → tenants.id)
 * - Um tenant tem N pedidos (orders.tenant_id → tenants.id)
 * - Um tenant tem N usuários (users.tenant_id → tenants.id)
 * - Um tenant tem N entregadores (drivers.tenant_id → tenants.id)
 * 
 * SEGURANÇA:
 * - Super Admins (Vynlo Tech): tenant_id = NULL (acesso global)
 * - Clientes normais: tenant_id != NULL (acesso restrito)
 * 
 * MIGRATION: V11__Create_tenants_table.sql
 * 
 * @version 1.0.0
 * @author Vynlo Tech - Multi-Tenancy Implementation
 * @created 2025-10-17
 * ============================================================================
 */
@Entity
@Table(name = "tenants", indexes = {
    @Index(name = "idx_tenants_firebase_uid", columnList = "firebaseUid", unique = true),
    @Index(name = "idx_tenants_status", columnList = "status"),
    @Index(name = "idx_tenants_cnpj", columnList = "cnpj"),
    @Index(name = "idx_tenants_vynlo_product", columnList = "vynloProduct"),
    @Index(name = "idx_tenants_company_name", columnList = "companyName")
})
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * UID do Firebase do admin que criou este tenant
     * Relacionado ao campo "adminEmail" do ClientManagementController
     */
    @NotBlank(message = "Firebase UID é obrigatório")
    @Column(name = "firebase_uid", unique = true, nullable = false, length = 128)
    private String firebaseUid;

    /**
     * Nome da empresa/restaurante/igreja
     */
    @NotBlank(message = "Nome da empresa é obrigatório")
    @Size(min = 2, max = 255, message = "Nome deve ter entre 2 e 255 caracteres")
    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    /**
     * CNPJ da empresa (Brasil) - opcional
     * Formato: 00.000.000/0000-00
     */
    @Pattern(regexp = "^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$|^$", message = "CNPJ inválido")
    @Column(length = 18, unique = true)
    private String cnpj;

    /**
     * Produto Vynlo associado: TASTE, EKKLESIA, BOT, SAUDE, etc
     */
    @NotBlank(message = "Produto Vynlo é obrigatório")
    @Column(name = "vynlo_product", nullable = false, length = 50)
    private String vynloProduct = "TASTE";

    /**
     * Tipo de cliente: RESTAURANT, CHURCH, CLINIC, PET_SHOP, BARBERSHOP, etc
     */
    @Column(name = "client_type", length = 50)
    private String clientType = "RESTAURANT";

    /**
     * Status do tenant: ACTIVE, SUSPENDED, DELETED
     */
    @NotBlank(message = "Status é obrigatório")
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    /**
     * Metadata de auditoria
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ============================================================================
    // CONSTRUTORES
    // ============================================================================

    public Tenant() {}

    public Tenant(String firebaseUid, String companyName, String vynloProduct) {
        this.firebaseUid = firebaseUid;
        this.companyName = companyName;
        this.vynloProduct = vynloProduct;
        this.status = "ACTIVE";
    }

    // ============================================================================
    // MÉTODOS DE NEGÓCIO
    // ============================================================================

    public boolean isActive() {
        return "ACTIVE".equals(status) && deletedAt == null;
    }

    public boolean isSuspended() {
        return "SUSPENDED".equals(status);
    }

    public void suspend() {
        this.status = "SUSPENDED";
    }

    public void activate() {
        this.status = "ACTIVE";
        this.deletedAt = null;
    }

    public void softDelete() {
        this.status = "DELETED";
        this.deletedAt = LocalDateTime.now();
    }

    // ============================================================================
    // GETTERS E SETTERS
    // ============================================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirebaseUid() {
        return firebaseUid;
    }

    public void setFirebaseUid(String firebaseUid) {
        this.firebaseUid = firebaseUid;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getVynloProduct() {
        return vynloProduct;
    }

    public void setVynloProduct(String vynloProduct) {
        this.vynloProduct = vynloProduct;
    }

    public String getClientType() {
        return clientType;
    }

    public void setClientType(String clientType) {
        this.clientType = clientType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    // ============================================================================
    // TOSTRING, EQUALS, HASHCODE
    // ============================================================================

    @Override
    public String toString() {
        return "Tenant{" +
                "id=" + id +
                ", firebaseUid='" + firebaseUid + '\'' +
                ", companyName='" + companyName + '\'' +
                ", cnpj='" + cnpj + '\'' +
                ", vynloProduct='" + vynloProduct + '\'' +
                ", status='" + status + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tenant)) return false;
        Tenant tenant = (Tenant) o;
        return id != null && id.equals(tenant.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

