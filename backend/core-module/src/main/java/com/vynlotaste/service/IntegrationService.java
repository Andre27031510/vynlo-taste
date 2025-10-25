package com.vynlotaste.service;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.Integration;
import com.vynlotaste.repository.IntegrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * IntegrationService - Multi-Tenancy Support
 * v2.1.0 - Serviço de integrações com isolamento por tenant
 * Updated: 2025-10-25 | Validação de tenant_id em todas as operações
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IntegrationService {

    private final IntegrationRepository integrationRepository;

    @Cacheable(value = "integrations", key = "'id:' + #id + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public Integration findById(Long id) {
        log.debug("🔍 Buscando integração por ID: {}", id);

        // ✅ CORREÇÃO CRÍTICA: Buscar com filtro de tenant ANTES de retornar dados
        Integration integration;
        if (TenantContext.isSuperAdmin()) {
            // Super Admin: pode acessar qualquer integração
            integration = integrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Integração não encontrada: " + id));
        } else {
            // Cliente: buscar apenas integrações do seu tenant
            Long tenantId = TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - acesso negado");
                throw new RuntimeException("Integração não encontrada: " + id);
            }
            
            // Buscar integração e validar tenant_id
            integration = integrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Integração não encontrada: " + id));
            
            // Validar se a integração pertence ao tenant atual
            if (!tenantId.equals(integration.getTenantId())) {
                log.warn("🚫 Acesso negado: usuário (tenant_id={}) tentou acessar integração (tenant_id={}, id={})", 
                        tenantId, integration.getTenantId(), id);
                throw new RuntimeException("Integração não encontrada: " + id);
            }
            
            log.debug("✅ Integração encontrada: ID={}, tenant_id={}", id, tenantId);
        }

        return integration;
    }

    @Cacheable(value = "integrations", key = "'active:' + (#root.target.getCurrentTenantId() ?: 'super')",
               unless = "#result == null || #result.isEmpty()")
    public List<Integration> findActiveIntegrations() {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODAS as integrações ativas");
            return integrationRepository.findByActiveTrue();
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        
        log.debug("👤 Cliente (tenant_id={}): retornando integrações ativas do tenant", tenantId);
        return integrationRepository.findByActiveTrueAndTenantId(tenantId);
    }

    public Page<Integration> findAllIntegrations(Pageable pageable) {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODAS as integrações");
            return integrationRepository.findAll(pageable);
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando página vazia");
            return Page.empty(pageable);
        }
        log.debug("👤 Cliente (tenant_id={}): retornando integrações do tenant", tenantId);
        
        // Usar query otimizada do repository
        return integrationRepository.findAllByTenantId(tenantId, pageable);
    }

    @Transactional
    @Caching(put = {
        @CachePut(value = "integrations", key = "'id:' + #result.id"),
        @CachePut(value = "integrations", key = "'name:' + #result.name")
    })
    public Integration createIntegration(Integration integration) {
        log.info("📝 Criando nova integração: {} - Tipo: {}", integration.getName(), integration.getType());
        
        // ✅ MULTI-TENANT: Definir tenant_id automaticamente
        if (!TenantContext.isSuperAdmin()) {
            Long tenantId = TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - não é possível criar integração");
                throw new RuntimeException("Tenant não definido - não é possível criar integração");
            }
            integration.setTenantId(tenantId);
            log.debug("✅ Tenant_id definido: {}", tenantId);
        }
        
        // Definir valores padrão
        integration.setCreatedAt(LocalDateTime.now());
        integration.setUpdatedAt(LocalDateTime.now());
        integration.setActive(true);
        integration.setOrdersCount(0L);
        integration.setHealthScore(100);
        integration.setHealthStatus(Integration.HealthStatus.EXCELLENT);
        
        Integration savedIntegration = integrationRepository.save(integration);
        log.info("✅ Integração criada: ID={}, tenant_id={}", savedIntegration.getId(), savedIntegration.getTenantId());
        
        return savedIntegration;
    }

    @Transactional
    @Caching(put = {
        @CachePut(value = "integrations", key = "'id:' + #result.id"),
        @CachePut(value = "integrations", key = "'name:' + #result.name")
    })
    public Integration updateIntegration(Long id, Integration integrationUpdate) {
        Integration integration = findById(id);
        
        log.info("📝 Atualizando integração: {} - ID: {}", integration.getName(), id);
        
        // Atualizar campos
        integration.setName(integrationUpdate.getName());
        integration.setType(integrationUpdate.getType());
        integration.setStatus(integrationUpdate.getStatus());
        integration.setApiKey(integrationUpdate.getApiKey());
        integration.setWebhookUrl(integrationUpdate.getWebhookUrl());
        integration.setApiSecret(integrationUpdate.getApiSecret());
        integration.setConfiguration(integrationUpdate.getConfiguration());
        integration.setAutoReply(integrationUpdate.isAutoReply());
        integration.setNotifications(integrationUpdate.isNotifications());
        integration.setActive(integrationUpdate.isActive());
        integration.setUpdatedAt(LocalDateTime.now());
        
        Integration savedIntegration = integrationRepository.save(integration);
        log.info("✅ Integração atualizada: ID={}, tenant_id={}", savedIntegration.getId(), savedIntegration.getTenantId());
        
        return savedIntegration;
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "integrations", key = "'id:' + #id"),
        @CacheEvict(value = "integrations", allEntries = true)
    })
    public void deleteIntegration(Long id) {
        Integration integration = findById(id);
        integrationRepository.delete(integration);
        log.info("✅ Integração deletada: ID={}, tenant_id={}", id, integration.getTenantId());
    }

    @Transactional
    @CacheEvict(value = "integrations", allEntries = true)
    public Integration connectIntegration(Long id) {
        Integration integration = findById(id);
        
        log.info("🔌 Conectando integração: {} - ID: {}", integration.getName(), id);
        
        integration.setStatus(Integration.IntegrationStatus.CONNECTED);
        integration.setLastSyncAt(LocalDateTime.now());
        integration.setHealthStatus(Integration.HealthStatus.EXCELLENT);
        integration.setHealthScore(100);
        integration.setUpdatedAt(LocalDateTime.now());
        
        Integration savedIntegration = integrationRepository.save(integration);
        log.info("✅ Integração conectada: ID={}, tenant_id={}", savedIntegration.getId(), savedIntegration.getTenantId());
        
        return savedIntegration;
    }

    @Transactional
    @CacheEvict(value = "integrations", allEntries = true)
    public Integration disconnectIntegration(Long id) {
        Integration integration = findById(id);
        
        log.info("🔌 Desconectando integração: {} - ID: {}", integration.getName(), id);
        
        integration.setStatus(Integration.IntegrationStatus.DISCONNECTED);
        integration.setHealthStatus(Integration.HealthStatus.DISCONNECTED);
        integration.setHealthScore(0);
        integration.setUpdatedAt(LocalDateTime.now());
        
        Integration savedIntegration = integrationRepository.save(integration);
        log.info("✅ Integração desconectada: ID={}, tenant_id={}", savedIntegration.getId(), savedIntegration.getTenantId());
        
        return savedIntegration;
    }

    @Transactional
    @CacheEvict(value = "integrations", allEntries = true)
    public Integration updateHealthStatus(Long id, Integration.HealthStatus healthStatus, Integer healthScore, String errorMessage) {
        Integration integration = findById(id);
        
        log.info("🏥 Atualizando status de saúde da integração: {} - ID: {}", integration.getName(), id);
        
        integration.setHealthStatus(healthStatus);
        integration.setHealthScore(healthScore);
        integration.setLastErrorAt(LocalDateTime.now());
        integration.setLastErrorMessage(errorMessage);
        integration.setUpdatedAt(LocalDateTime.now());
        
        Integration savedIntegration = integrationRepository.save(integration);
        log.info("✅ Status de saúde atualizado: ID={}, status={}, score={}", 
                savedIntegration.getId(), healthStatus, healthScore);
        
        return savedIntegration;
    }

    // Método auxiliar para obter tenant_id atual (usado nos caches)
    public Long getCurrentTenantId() {
        return TenantContext.getCurrentTenantId();
    }
}
