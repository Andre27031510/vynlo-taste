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
 * Entidade SystemConfig - Configurações do Sistema
 * ============================================================================
 * 
 * CONTEXTO: Configurações globais e por tenant do sistema
 * OBJETIVO: Centralizar todas as configurações em um local seguro
 * ESTRATÉGIA: Multi-tenancy com configurações globais e específicas por tenant
 * 
 * RELACIONAMENTOS:
 * - Configurações globais: tenant_id = NULL (aplicam a todos)
 * - Configurações por tenant: tenant_id != NULL (específicas do cliente)
 * 
 * SEGURANÇA:
 * - Super Admins: Podem criar/editar configurações globais
 * - Clientes: Podem editar apenas suas configurações específicas
 * 
 * @version 1.0.0
 * @author Vynlo Tech - System Configuration
 * @created 2025-10-25
 * ============================================================================
 */
@Entity
@Table(name = "system_configs", indexes = {
    @Index(name = "idx_system_configs_tenant_id", columnList = "tenant_id"),
    @Index(name = "idx_system_configs_category", columnList = "category"),
    @Index(name = "idx_system_configs_key", columnList = "config_key"),
    @Index(name = "idx_system_configs_scope", columnList = "scope")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Chave da configuração é obrigatória")
    @Column(name = "config_key", nullable = false, length = 100)
    private String configKey;

    @NotBlank(message = "Valor da configuração é obrigatório")
    @Column(name = "config_value", nullable = false, length = 2000)
    private String configValue;

    @NotBlank(message = "Categoria da configuração é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ConfigCategory category;

    @NotBlank(message = "Escopo da configuração é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConfigScope scope;

    @Column(length = 500)
    private String description;

    @Column(name = "default_value", length = 2000)
    private String defaultValue;

    @Column(name = "validation_rules", length = 1000)
    private String validationRules; // JSON com regras de validação

    @Column(name = "is_encrypted")
    @Builder.Default
    private boolean encrypted = false;

    @Column(name = "is_readonly")
    @Builder.Default
    private boolean readonly = false;

    @Column(name = "is_required")
    @Builder.Default
    private boolean required = false;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    /**
     * Multi-Tenancy: ID do tenant (restaurante/empresa) ao qual a configuração pertence
     * NULL = Configuração global (aplica a todos os tenants)
     * NOT NULL = Configuração específica do tenant
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
    public enum ConfigCategory {
        APPEARANCE("Aparência"),
        SYSTEM("Sistema"),
        SECURITY("Segurança"),
        NOTIFICATIONS("Notificações"),
        INTEGRATIONS("Integrações"),
        BACKUP("Backup"),
        PERFORMANCE("Performance"),
        BUSINESS("Negócio"),
        DELIVERY("Delivery"),
        PAYMENT("Pagamento");

        private final String displayName;

        ConfigCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum ConfigScope {
        GLOBAL("Global"),
        TENANT("Tenant"),
        USER("Usuário");

        private final String displayName;

        ConfigScope(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
