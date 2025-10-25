package com.vynlotaste.controller;

import com.vynlotaste.entity.Integration;
import com.vynlotaste.service.IntegrationService;
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

/**
 * Controller para operações de integrações
 * v2.1.0 - Integrações multi-canal com multi-tenancy
 * Fix: Isolamento completo por tenant_id
 */
@RestController
@RequestMapping("/v1/integrations")
@RequiredArgsConstructor
@Slf4j
public class IntegrationController {

    private final IntegrationService integrationService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integration> createIntegration(@Valid @RequestBody Integration integration) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode criar integrações para qualquer tenant | Cliente: cria integrações para seu tenant
        log.info("📝 Criando nova integração: {} - Tipo: {}", integration.getName(), integration.getType());
        Integration createdIntegration = integrationService.createIntegration(integration);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIntegration);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllIntegrations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: vê todas as integrações | Cliente: vê apenas suas integrações
        try {
            Pageable pageable = PageRequest.of(page - 1, limit);
            Page<Integration> integrations = integrationService.findAllIntegrations(pageable);
            
            return ResponseEntity.ok(Map.of(
                "integrations", integrations.getContent(),
                "total", integrations.getTotalElements(),
                "page", page,
                "totalPages", integrations.getTotalPages(),
                "hasNext", integrations.hasNext(),
                "hasPrevious", integrations.hasPrevious()
            ));
        } catch (Exception e) {
            log.error("❌ Erro ao buscar integrações", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Integration>> getActiveIntegrations() {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: vê todas as integrações ativas | Cliente: vê apenas suas integrações ativas
        try {
            List<Integration> activeIntegrations = integrationService.findActiveIntegrations();
            return ResponseEntity.ok(activeIntegrations);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar integrações ativas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integration> getIntegrationById(@PathVariable Long id) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode acessar qualquer integração | Cliente: acessa apenas suas integrações
        try {
            Integration integration = integrationService.findById(id);
            return ResponseEntity.ok(integration);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar integração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integration> updateIntegration(
            @PathVariable Long id,
            @Valid @RequestBody Integration integrationUpdate) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode atualizar qualquer integração | Cliente: atualiza apenas suas integrações
        try {
            Integration updatedIntegration = integrationService.updateIntegration(id, integrationUpdate);
            return ResponseEntity.ok(updatedIntegration);
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar integração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteIntegration(@PathVariable Long id) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode deletar qualquer integração | Cliente: deleta apenas suas integrações
        try {
            integrationService.deleteIntegration(id);
            return ResponseEntity.ok(Map.of("message", "Integração deletada com sucesso"));
        } catch (Exception e) {
            log.error("❌ Erro ao deletar integração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Integração não encontrada", "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/connect")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integration> connectIntegration(@PathVariable Long id) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode conectar qualquer integração | Cliente: conecta apenas suas integrações
        try {
            Integration connectedIntegration = integrationService.connectIntegration(id);
            return ResponseEntity.ok(connectedIntegration);
        } catch (Exception e) {
            log.error("❌ Erro ao conectar integração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/{id}/disconnect")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integration> disconnectIntegration(@PathVariable Long id) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode desconectar qualquer integração | Cliente: desconecta apenas suas integrações
        try {
            Integration disconnectedIntegration = integrationService.disconnectIntegration(id);
            return ResponseEntity.ok(disconnectedIntegration);
        } catch (Exception e) {
            log.error("❌ Erro ao desconectar integração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getIntegrationStats() {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: vê estatísticas globais | Cliente: vê estatísticas do seu tenant
        try {
            List<Integration> activeIntegrations = integrationService.findActiveIntegrations();
            
            long totalIntegrations = activeIntegrations.size();
            long activeCount = activeIntegrations.stream()
                .filter(i -> i.getStatus() == Integration.IntegrationStatus.CONNECTED)
                .count();
            long totalOrders = activeIntegrations.stream()
                .mapToLong(i -> i.getOrdersCount() != null ? i.getOrdersCount() : 0)
                .sum();
            
            double syncRate = activeCount > 0 ? (double) activeCount / totalIntegrations * 100 : 0;
            int healthScore = activeIntegrations.isEmpty() ? 0 : 
                (int) activeIntegrations.stream()
                    .mapToInt(i -> i.getHealthScore() != null ? i.getHealthScore() : 0)
                    .average()
                    .orElse(0);
            
            return ResponseEntity.ok(Map.of(
                "totalIntegrations", totalIntegrations,
                "activeIntegrations", activeCount,
                "totalOrders", totalOrders,
                "syncRate", Math.round(syncRate * 10.0) / 10.0,
                "healthScore", healthScore,
                "lastUpdate", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            log.error("❌ Erro ao buscar estatísticas de integrações", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error", "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/health")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integration> updateHealthStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> healthData) {
        // ✅ VALIDAÇÃO MULTI-TENANT: Service já filtra automaticamente por tenant_id
        // Super Admin: pode atualizar saúde de qualquer integração | Cliente: atualiza apenas suas integrações
        try {
            Integration.HealthStatus healthStatus = Integration.HealthStatus.valueOf(
                healthData.get("healthStatus").toString());
            Integer healthScore = Integer.valueOf(healthData.get("healthScore").toString());
            String errorMessage = healthData.get("errorMessage") != null ? 
                healthData.get("errorMessage").toString() : null;
            
            Integration updatedIntegration = integrationService.updateHealthStatus(id, healthStatus, healthScore, errorMessage);
            return ResponseEntity.ok(updatedIntegration);
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar status de saúde da integração: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
