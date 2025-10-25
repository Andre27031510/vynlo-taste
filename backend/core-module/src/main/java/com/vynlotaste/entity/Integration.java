package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade Integration - Multi-Tenancy (Isolamento de Dados)
 * ============================================================================
 * 
 * CONTEXTO: Cada integração pertence a um tenant específico
 * OBJETIVO: Isolar integrações entre clientes (Restaurante X NÃO vê integrações Restaurant Y)
 * ESTRATÉGIA: Row-Level Multi-Tenancy com tenant_id em todas as tabelas
 * 
 * RELACIONAMENTOS:
 * - Um tenant tem N integrações (integrations.tenant_id → tenants.id)
 * - Uma integração tem N pedidos externos (external_orders.integration_id → integrations.id)
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
@Table(name = "integrations", indexes = {
    @Index(name = "idx_integrations_tenant_id", columnList = "tenant_id"),
    @Index(name = "idx_integrations_type", columnList = "type"),
    @Index(name = "idx_integrations_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Integration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome da integração é obrigatório")
    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IntegrationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IntegrationStatus status;

    @Column(length = 500)
    private String apiKey;

    @Column(length = 500)
    private String webhookUrl;

    @Column(length = 500)
    private String apiSecret;

    @Column(length = 1000)
    private String configuration; // JSON com configurações específicas

    @Column(nullable = false)
    @Builder.Default
    private boolean autoReply = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean notifications = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "orders_count")
    @Builder.Default
    private Long ordersCount = 0L;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "last_error_at")
    private LocalDateTime lastErrorAt;

    @Column(length = 1000)
    private String lastErrorMessage;

    @Column(name = "health_score")
    @Builder.Default
    private Integer healthScore = 100;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private HealthStatus healthStatus = HealthStatus.EXCELLENT;

    /**
     * Multi-Tenancy: ID do tenant (restaurante/empresa) ao qual a integração pertence
     * NULL = Super Admin (Vynlo Tech, acesso global)
     * NOT NULL = Cliente específico (integrações isoladas por restaurante)
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
    public enum IntegrationType {
        IFOOD("iFood"),
        UBER_EATS("Uber Eats"),
        WHATSAPP("WhatsApp Business"),
        WEBSITE("Site Próprio"),
        APP("App Mobile"),
        TELEGRAM("Telegram"),
        INSTAGRAM("Instagram"),
        FACEBOOK("Facebook");

        private final String displayName;

        IntegrationType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum IntegrationStatus {
        CONNECTED("Conectado"),
        PENDING("Pendente"),
        DISCONNECTED("Desconectado"),
        ERROR("Erro"),
        MAINTENANCE("Manutenção");

        private final String displayName;

        IntegrationStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum HealthStatus {
        EXCELLENT("Excelente"),
        GOOD("Boa"),
        WARNING("Atenção"),
        CRITICAL("Crítico"),
        DISCONNECTED("Desconectado");

        private final String displayName;

        HealthStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
