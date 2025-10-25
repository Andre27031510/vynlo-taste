package com.vynlotaste.controller;

import com.vynlotaste.entity.SystemConfig;
import com.vynlotaste.service.SystemConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller para operações de configurações do sistema
 * v2.1.0 - Configurações multi-categoria com multi-tenancy
 * Fix: Isolamento completo por tenant_id
 */
@RestController
@RequestMapping("/v1/system-configs")
@RequiredArgsConstructor
@Slf4j
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SystemConfig> createConfig(@Valid @RequestBody SystemConfig config) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode criar configurações globais | Cliente: cria configurações para seu tenant
        log.info("📝 Criando nova configuração: {} - Categoria: {}", config.getConfigKey(), config.getCategory());
        SystemConfig createdConfig = systemConfigService.createConfig(config);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdConfig);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllConfigs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: vê todas as configurações | Cliente: vê apenas suas configurações
        try {
            Pageable pageable = PageRequest.of(page - 1, limit);
            Page<SystemConfig> configs = systemConfigService.findAllConfigs(pageable);
            
            return ResponseEntity.ok(Map.of(
                "configs", configs.getContent(),
                "total", configs.getTotalElements(),
                "page", page,
                "totalPages", configs.getTotalPages(),
                "hasNext", configs.hasNext(),
                "hasPrevious", configs.hasPrevious()
            ));
        } catch (Exception e) {
            log.error("❌ Erro ao buscar configurações", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SystemConfig>> getConfigsByCategory(@PathVariable String category) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: vê todas as configurações da categoria | Cliente: vê apenas suas configurações da categoria
        try {
            SystemConfig.ConfigCategory configCategory = SystemConfig.ConfigCategory.valueOf(category.toUpperCase());
            List<SystemConfig> configs = systemConfigService.findByCategory(configCategory);
            return ResponseEntity.ok(configs);
        } catch (IllegalArgumentException e) {
            log.error("❌ Categoria inválida: {}", category);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(List.of());
        } catch (Exception e) {
            log.error("❌ Erro ao buscar configurações da categoria: {}", category, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    @GetMapping("/key/{configKey}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getConfigByKey(@PathVariable String configKey) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode acessar qualquer configuração | Cliente: acessa apenas suas configurações
        try {
            Optional<SystemConfig> config = systemConfigService.findByConfigKey(configKey);
            if (config.isPresent()) {
                return ResponseEntity.ok(config.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Configuração não encontrada", "key", configKey));
            }
        } catch (Exception e) {
            log.error("❌ Erro ao buscar configuração: {}", configKey, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @GetMapping("/value/{configKey}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getConfigValue(@PathVariable String configKey) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode acessar qualquer valor | Cliente: acessa apenas seus valores
        try {
            String value = systemConfigService.getConfigValue(configKey);
            if (value != null) {
                return ResponseEntity.ok(Map.of("key", configKey, "value", value));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Configuração não encontrada", "key", configKey));
            }
        } catch (Exception e) {
            log.error("❌ Erro ao buscar valor da configuração: {}", configKey, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @GetMapping("/value/{configKey}/{defaultValue}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getConfigValueWithDefault(@PathVariable String configKey, @PathVariable String defaultValue) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        try {
            String value = systemConfigService.getConfigValue(configKey, defaultValue);
            return ResponseEntity.ok(Map.of("key", configKey, "value", value, "default", defaultValue));
        } catch (Exception e) {
            log.error("❌ Erro ao buscar valor da configuração: {}", configKey, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SystemConfig> getConfigById(@PathVariable Long id) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode acessar qualquer configuração | Cliente: acessa apenas suas configurações
        try {
            SystemConfig config = systemConfigService.findById(id);
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar configuração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SystemConfig> updateConfig(
            @PathVariable Long id,
            @Valid @RequestBody SystemConfig configUpdate) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode atualizar qualquer configuração | Cliente: atualiza apenas suas configurações
        try {
            SystemConfig updatedConfig = systemConfigService.updateConfig(id, configUpdate);
            return ResponseEntity.ok(updatedConfig);
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar configuração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteConfig(@PathVariable Long id) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode deletar qualquer configuração | Cliente: deleta apenas suas configurações
        try {
            systemConfigService.deleteConfig(id);
            return ResponseEntity.ok(Map.of("message", "Configuração deletada com sucesso"));
        } catch (Exception e) {
            log.error("❌ Erro ao deletar configuração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Configuração não encontrada", "message", e.getMessage()));
        }
    }

    @GetMapping("/categories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getConfigCategories() {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        try {
            Map<String, Object> categories = Map.of(
                "categories", SystemConfig.ConfigCategory.values(),
                "scopes", SystemConfig.ConfigScope.values(),
                "totalCategories", SystemConfig.ConfigCategory.values().length,
                "totalScopes", SystemConfig.ConfigScope.values().length
            );
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar categorias de configuração", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllEffectiveConfigs() {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: vê todas as configurações | Cliente: vê apenas suas configurações efetivas
        try {
            Map<String, String> allConfigs = systemConfigService.getAllEffectiveConfigs();
            return ResponseEntity.ok(Map.of(
                "configs", allConfigs,
                "total", allConfigs.size(),
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            log.error("❌ Erro ao buscar todas as configurações", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @PostMapping("/bulk-update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> bulkUpdateConfigs(@RequestBody Map<String, String> configs) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode atualizar configurações globais | Cliente: atualiza apenas suas configurações
        try {
            systemConfigService.bulkUpdateConfigs(configs);
            return ResponseEntity.ok(Map.of(
                "message", "Configurações atualizadas em lote com sucesso",
                "updatedCount", configs.size(),
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar configurações em lote", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getConfigStats() {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: vê estatísticas globais | Cliente: vê estatísticas do seu tenant
        try {
            Map<String, String> allConfigs = systemConfigService.getAllEffectiveConfigs();
            
            // Contar configurações por categoria
            Map<String, Long> categoryStats = allConfigs.keySet().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    key -> {
                        // Extrair categoria da chave (ex: "appearance.theme" -> "appearance")
                        String[] parts = key.split("\\.");
                        return parts.length > 0 ? parts[0] : "other";
                    },
                    java.util.stream.Collectors.counting()
                ));
            
            return ResponseEntity.ok(Map.of(
                "totalConfigs", allConfigs.size(),
                "categoryStats", categoryStats,
                "lastUpdate", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estatísticas de configurações", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }
}
