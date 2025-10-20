package com.vynlotaste.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * ============================================================================
 * VYNLO TASTE - CORE MODULE APPLICATION
 * ============================================================================
 * Aplicação principal do módulo core do Vynlo Taste (sistema multi-tenant)
 * 
 * CONFIGURAÇÕES CRÍTICAS:
 * - @EnableJpaAuditing: Habilita auditing automático (@CreatedDate, @LastModifiedDate)
 *   Sem essa anotação, campos created_at e updated_at ficam NULL, causando:
 *   ERROR: null value in column "created_at" violates not-null constraint
 * 
 * - @EntityScan: Escaneia entidades JPA em múltiplos pacotes
 * - @EnableJpaRepositories: Habilita repositórios JPA em múltiplos pacotes
 * 
 * ENTIDADES COM AUDITING AUTOMÁTICO:
 * - Driver (motoboys/entregadores)
 * - Delivery (entregas)
 * - Outras entidades com @CreatedDate/@LastModifiedDate
 * 
 * MULTI-TENANCY:
 * Sistema isolado por tenant_id (restaurantes/empresas diferentes)
 * TenantContext gerencia o tenant_id da requisição atual
 * 
 * @version 2.0
 * @since 2025-01-01
 * ============================================================================
 */
@SpringBootApplication(scanBasePackages = "com.vynlotaste")
@EntityScan(basePackages = {"com.vynlotaste.entity", "com.vynlotaste.webhook"})
@EnableJpaRepositories(basePackages = {"com.vynlotaste.repository", "com.vynlotaste.webhook"})
@EnableJpaAuditing // ✅ CRÍTICO: Popula created_at/updated_at automaticamente (evita HTTP 400)
public class CoreModuleApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoreModuleApplication.class, args);
    }
}