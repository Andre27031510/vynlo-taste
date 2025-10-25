package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade ExternalOrder - Pedidos de Plataformas Externas
 * ============================================================================
 * 
 * CONTEXTO: Pedidos vindos de plataformas externas (iFood, Uber Eats, WhatsApp)
 * OBJETIVO: Sincronizar pedidos externos com o sistema interno
 * ESTRATÉGIA: Multi-Tenancy com tenant_id + relacionamento com Integration
 * 
 * RELACIONAMENTOS:
 * - Um tenant tem N pedidos externos (external_orders.tenant_id → tenants.id)
 * - Uma integração tem N pedidos externos (external_orders.integration_id → integrations.id)
 * - Um pedido externo pode gerar um pedido interno (external_orders.id → orders.external_order_id)
 * 
 * SEGURANÇA:
 * - Super Admins (Vynlo Tech): tenant_id = NULL (acesso global)
 * - Clientes normais: tenant_id != NULL (acesso restrito)
 * 
 * @version 1.0.0
 * @author Vynlo Tech - Multi-Tenancy Implementation
 * @created 2025-10-25
 * ============================================================================
 */
@Entity
@Table(name = "external_orders", indexes = {
    @Index(name = "idx_external_orders_tenant_id", columnList = "tenant_id"),
    @Index(name = "idx_external_orders_integration_id", columnList = "integration_id"),
    @Index(name = "idx_external_orders_external_id", columnList = "external_id"),
    @Index(name = "idx_external_orders_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ID externo é obrigatório")
    @Column(name = "external_id", nullable = false, length = 100)
    private String externalId;

    @NotNull(message = "Integração é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "integration_id", nullable = false)
    private Integration integration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExternalOrderStatus status;

    @Column(name = "customer_name", length = 200)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 200)
    private String customerEmail;

    @Column(name = "delivery_address", length = 500)
    private String deliveryAddress;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "delivery_fee", precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    @Column(name = "service_fee", precision = 10, scale = 2)
    private BigDecimal serviceFee;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    @Column(name = "external_created_at")
    private LocalDateTime externalCreatedAt;

    @Column(name = "external_updated_at")
    private LocalDateTime externalUpdatedAt;

    @Column(length = 2000)
    private String notes;

    @Column(length = 2000)
    private String items; // JSON com itens do pedido

    @Column(length = 1000)
    private String metadata; // JSON com metadados específicos da plataforma

    @Column(name = "sync_status", length = 20)
    @Builder.Default
    private String syncStatus = "PENDING";

    @Column(name = "sync_attempts")
    @Builder.Default
    private Integer syncAttempts = 0;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "last_sync_error", length = 1000)
    private String lastSyncError;

    @Column(name = "internal_order_id")
    private Long internalOrderId; // ID do pedido criado internamente

    /**
     * Multi-Tenancy: ID do tenant (restaurante/empresa) ao qual o pedido externo pertence
     * NULL = Super Admin (Vynlo Tech, acesso global)
     * NOT NULL = Cliente específico (pedidos isolados por restaurante)
     */
    @Column(name = "tenant_id")
    private Long tenantId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Enums
    public enum ExternalOrderStatus {
        PENDING("Pendente"),
        CONFIRMED("Confirmado"),
        PREPARING("Preparando"),
        READY("Pronto"),
        OUT_FOR_DELIVERY("Saiu para Entrega"),
        DELIVERED("Entregue"),
        CANCELLED("Cancelado"),
        REFUNDED("Reembolsado");

        private final String displayName;

        ExternalOrderStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
