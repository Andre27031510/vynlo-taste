package com.vynlotaste.service;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.SystemConfig;
import com.vynlotaste.repository.SystemConfigRepository;
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
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * SystemConfigService - Multi-Tenancy Support
 * v2.1.0 - Serviço de configurações com isolamento por tenant
 * Updated: 2025-10-25 | Validação de tenant_id em todas as operações
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Cacheable(value = "system-configs", key = "'id:' + #id + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public SystemConfig findById(Long id) {
        log.debug("🔍 Buscando configuração por ID: {}", id);

        // ✅ CORREÇÃO CRÍTICA: Buscar com filtro de tenant ANTES de retornar dados
        SystemConfig config;
        if (TenantContext.isSuperAdmin()) {
            // Super Admin: pode acessar qualquer configuração
            config = systemConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada: " + id));
        } else {
            // Cliente: buscar apenas configurações do seu tenant ou globais
            Long tenantId = TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - acesso negado");
                throw new RuntimeException("Configuração não encontrada: " + id);
            }
            
            // Buscar configuração e validar acesso
            config = systemConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada: " + id));
            
            // Validar se a configuração pertence ao tenant atual ou é global
            if (config.getTenantId() != null && !tenantId.equals(config.getTenantId())) {
                log.warn("🚫 Acesso negado: usuário (tenant_id={}) tentou acessar configuração (tenant_id={}, id={})", 
                        tenantId, config.getTenantId(), id);
                throw new RuntimeException("Configuração não encontrada: " + id);
            }
            
            log.debug("✅ Configuração encontrada: ID={}, tenant_id={}", id, config.getTenantId());
        }

        return config;
    }

    @Cacheable(value = "system-configs", key = "'category:' + #category + ':' + (#root.target.getCurrentTenantId() ?: 'super')",
               unless = "#result == null || #result.isEmpty()")
    public List<SystemConfig> findByCategory(SystemConfig.ConfigCategory category) {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODAS as configurações da categoria: {}", category);
            return systemConfigRepository.findByCategory(category);
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        
        log.debug("👤 Cliente (tenant_id={}): retornando configurações efetivas da categoria: {}", tenantId, category);
        return systemConfigRepository.findEffectiveConfigsByCategory(tenantId, category);
    }

    @Cacheable(value = "system-configs", key = "'key:' + #configKey + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public Optional<SystemConfig> findByConfigKey(String configKey) {
        // MULTI-TENANCY: Buscar configuração efetiva (global + tenant específica)
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: buscando configuração global: {}", configKey);
            return systemConfigRepository.findByConfigKey(configKey);
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando configuração global");
            return systemConfigRepository.findByConfigKey(configKey);
        }
        
        log.debug("👤 Cliente (tenant_id={}): buscando configuração efetiva: {}", tenantId, configKey);
        List<SystemConfig> configs = systemConfigRepository.findEffectiveConfigsByKey(tenantId, configKey);
        
        // Retornar configuração específica do tenant se existir, senão a global
        return configs.stream()
            .filter(c -> c.getTenantId() != null) // Priorizar configuração específica do tenant
            .findFirst()
            .or(() -> configs.stream()
                .filter(c -> c.getTenantId() == null) // Fallback para configuração global
                .findFirst());
    }

    @Cacheable(value = "system-configs", key = "'value:' + #configKey + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public String getConfigValue(String configKey) {
        return findByConfigKey(configKey)
            .map(SystemConfig::getConfigValue)
            .orElse(null);
    }

    @Cacheable(value = "system-configs", key = "'value:' + #configKey + ':' + #defaultValue + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public String getConfigValue(String configKey, String defaultValue) {
        return findByConfigKey(configKey)
            .map(SystemConfig::getConfigValue)
            .orElse(defaultValue);
    }

    public Page<SystemConfig> findAllConfigs(Pageable pageable) {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODAS as configurações");
            return systemConfigRepository.findAll(pageable);
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando página vazia");
            return Page.empty(pageable);
        }
        log.debug("👤 Cliente (tenant_id={}): retornando configurações do tenant", tenantId);
        
        // Usar query otimizada do repository
        return systemConfigRepository.findAllByTenantId(tenantId, pageable);
    }

    @Transactional
    @Caching(put = {
        @CachePut(value = "system-configs", key = "'id:' + #result.id"),
        @CachePut(value = "system-configs", key = "'key:' + #result.configKey + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    })
    public SystemConfig createConfig(SystemConfig config) {
        log.info("📝 Criando nova configuração: {} - Categoria: {}", config.getConfigKey(), config.getCategory());
        
        // ✅ MULTI-TENANT: Definir tenant_id automaticamente
        if (!TenantContext.isSuperAdmin()) {
            Long tenantId = TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - não é possível criar configuração");
                throw new RuntimeException("Tenant não definido - não é possível criar configuração");
            }
            config.setTenantId(tenantId);
            config.setScope(SystemConfig.ConfigScope.TENANT);
            log.debug("✅ Tenant_id definido: {}", tenantId);
        } else {
            // Super Admin pode criar configurações globais
            if (config.getScope() == null) {
                config.setScope(SystemConfig.ConfigScope.GLOBAL);
            }
        }
        
        // Definir valores padrão
        config.setCreatedAt(LocalDateTime.now());
        config.setUpdatedAt(LocalDateTime.now());
        
        // Validar unicidade da chave
        validateConfigKeyUniqueness(config);
        
        SystemConfig savedConfig = systemConfigRepository.save(config);
        log.info("✅ Configuração criada: ID={}, tenant_id={}", savedConfig.getId(), savedConfig.getTenantId());
        
        return savedConfig;
    }

    @Transactional
    @Caching(put = {
        @CachePut(value = "system-configs", key = "'id:' + #result.id"),
        @CachePut(value = "system-configs", key = "'key:' + #result.configKey + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    })
    public SystemConfig updateConfig(Long id, SystemConfig configUpdate) {
        SystemConfig config = findById(id);
        
        log.info("📝 Atualizando configuração: {} - ID: {}", config.getConfigKey(), id);
        
        // Atualizar campos
        config.setConfigValue(configUpdate.getConfigValue());
        config.setDescription(configUpdate.getDescription());
        config.setValidationRules(configUpdate.getValidationRules());
        config.setEncrypted(configUpdate.isEncrypted());
        config.setReadonly(configUpdate.isReadonly());
        config.setRequired(configUpdate.isRequired());
        config.setSortOrder(configUpdate.getSortOrder());
        config.setUpdatedAt(LocalDateTime.now());
        
        SystemConfig savedConfig = systemConfigRepository.save(config);
        log.info("✅ Configuração atualizada: ID={}, tenant_id={}", savedConfig.getId(), savedConfig.getTenantId());
        
        return savedConfig;
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "system-configs", key = "'id:' + #id"),
        @CacheEvict(value = "system-configs", allEntries = true)
    })
    public void deleteConfig(Long id) {
        SystemConfig config = findById(id);
        systemConfigRepository.delete(config);
        log.info("✅ Configuração deletada: ID={}, tenant_id={}", id, config.getTenantId());
    }

    @Cacheable(value = "system-configs", key = "'all-by-category:' + #category + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public Map<String, String> getConfigsByCategory(SystemConfig.ConfigCategory category) {
        List<SystemConfig> configs = findByCategory(category);
        return configs.stream()
            .collect(Collectors.toMap(
                SystemConfig::getConfigKey,
                SystemConfig::getConfigValue,
                (existing, replacement) -> replacement // Em caso de duplicata, usar o último
            ));
    }

    @Cacheable(value = "system-configs", key = "'all-effective:' + (#root.target.getCurrentTenantId() ?: 'super')")
    public Map<String, String> getAllEffectiveConfigs() {
        Map<String, String> allConfigs = new java.util.HashMap<>();
        
        // Buscar todas as categorias
        for (SystemConfig.ConfigCategory category : SystemConfig.ConfigCategory.values()) {
            Map<String, String> categoryConfigs = getConfigsByCategory(category);
            allConfigs.putAll(categoryConfigs);
        }
        
        return allConfigs;
    }

    @Transactional
    @CacheEvict(value = "system-configs", allEntries = true)
    public void bulkUpdateConfigs(Map<String, String> configs) {
        log.info("📝 Atualizando configurações em lote: {} configurações", configs.size());
        
        Long tenantId = TenantContext.getCurrentTenantId();
        
        for (Map.Entry<String, String> entry : configs.entrySet()) {
            String configKey = entry.getKey();
            String configValue = entry.getValue();
            
            Optional<SystemConfig> existingConfig = findByConfigKey(configKey);
            
            if (existingConfig.isPresent()) {
                // Atualizar configuração existente
                SystemConfig config = existingConfig.get();
                config.setConfigValue(configValue);
                config.setUpdatedAt(LocalDateTime.now());
                systemConfigRepository.save(config);
            } else {
                // Criar nova configuração
                SystemConfig newConfig = SystemConfig.builder()
                    .configKey(configKey)
                    .configValue(configValue)
                    .category(SystemConfig.ConfigCategory.SYSTEM) // Categoria padrão
                    .scope(tenantId != null ? SystemConfig.ConfigScope.TENANT : SystemConfig.ConfigScope.GLOBAL)
                    .tenantId(tenantId)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
                
                systemConfigRepository.save(newConfig);
            }
        }
        
        log.info("✅ Configurações atualizadas em lote com sucesso");
    }

    // Métodos auxiliares
    private void validateConfigKeyUniqueness(SystemConfig config) {
        Long tenantId = config.getTenantId();
        String configKey = config.getConfigKey();
        
        if (tenantId != null) {
            long count = systemConfigRepository.countByConfigKeyAndTenantId(configKey, tenantId);
            if (count > 0) {
                throw new RuntimeException("Configuração com chave '" + configKey + "' já existe para este tenant");
            }
        } else {
            long count = systemConfigRepository.countGlobalConfigsByKey(configKey);
            if (count > 0) {
                throw new RuntimeException("Configuração global com chave '" + configKey + "' já existe");
            }
        }
    }

    // Método auxiliar para obter tenant_id atual (usado nos caches)
    public Long getCurrentTenantId() {
        return TenantContext.getCurrentTenantId();
    }
}