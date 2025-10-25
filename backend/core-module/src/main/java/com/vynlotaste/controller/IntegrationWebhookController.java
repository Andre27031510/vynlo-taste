package com.vynlotaste.controller;

import com.vynlotaste.entity.ExternalOrder;
import com.vynlotaste.entity.Integration;
import com.vynlotaste.repository.IntegrationRepository;
import com.vynlotaste.service.ExternalOrderSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Controller para webhooks de plataformas externas
 * v2.1.0 - Recebe pedidos de iFood, Uber Eats, WhatsApp, etc.
 * Fix: Multi-tenancy e validação de integrações
 */
@RestController
@RequestMapping("/api/webhooks/integrations")
@RequiredArgsConstructor
@Slf4j
public class IntegrationWebhookController {

    private final IntegrationRepository integrationRepository;
    private final ExternalOrderSyncService externalOrderSyncService;

    /**
     * Webhook genérico para qualquer plataforma externa
     * ✅ MULTI-TENANT: Validação de integração por tenant_id
     */
    @PostMapping("/{platform}")
    public ResponseEntity<?> handlePlatformWebhook(
            @PathVariable String platform,
            @RequestHeader(value = "X-Integration-Key", required = false) String integrationKey,
            @RequestHeader(value = "X-Signature", required = false) String signature,
            @RequestBody Map<String, Object> webhookData) {
        
        log.info("🔔 Webhook recebido da plataforma: {} - Dados: {}", platform, webhookData);
        
        try {
            // ✅ VALIDAÇÃO: Verificar se a integração existe e está ativa
            if (integrationKey == null) {
                log.warn("❌ Webhook sem chave de integração da plataforma: {}", platform);
                return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Chave de integração obrigatória",
                    "processed", false
                ));
            }
            
            // Buscar integração pela chave
            Integration integration = integrationRepository.findByApiKey(integrationKey)
                .orElse(null);
            
            if (integration == null) {
                log.warn("❌ Integração não encontrada para chave: {}", integrationKey);
                return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Integração não encontrada",
                    "processed", false
                ));
            }
            
            if (!integration.isActive()) {
                log.warn("❌ Integração inativa: {}", integration.getName());
                return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Integração inativa",
                    "processed", false
                ));
            }
            
            // ✅ VALIDAÇÃO: Verificar se a plataforma corresponde
            if (!integration.getType().name().equalsIgnoreCase(platform.replace("-", "_"))) {
                log.warn("❌ Plataforma não corresponde à integração: {} vs {}", platform, integration.getType());
                return ResponseEntity.status(400).body(Map.of(
                    "status", "error",
                    "message", "Plataforma não corresponde à integração",
                    "processed", false
                ));
            }
            
            log.info("✅ Integração validada: {} - Tenant: {}", integration.getName(), integration.getTenantId());
            
            // Processar webhook baseado na plataforma
            switch (platform.toLowerCase()) {
                case "ifood":
                    return processIFoodWebhook(integration, webhookData);
                case "uber-eats":
                    return processUberEatsWebhook(integration, webhookData);
                case "whatsapp":
                    return processWhatsAppWebhook(integration, webhookData);
                default:
                    return processGenericWebhook(integration, webhookData);
            }
            
        } catch (Exception e) {
            log.error("❌ Erro ao processar webhook da plataforma: {}", platform, e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Erro interno do servidor",
                "processed", false
            ));
        }
    }

    /**
     * Processar webhook específico do iFood
     */
    private ResponseEntity<?> processIFoodWebhook(Integration integration, Map<String, Object> webhookData) {
        try {
            log.info("🍔 Processando webhook do iFood para integração: {}", integration.getName());
            
            // Extrair dados do pedido do iFood
            String externalId = webhookData.get("id") != null ? webhookData.get("id").toString() : null;
            String status = webhookData.get("status") != null ? webhookData.get("status").toString() : null;
            String customerName = webhookData.get("customer_name") != null ? webhookData.get("customer_name").toString() : null;
            String customerPhone = webhookData.get("customer_phone") != null ? webhookData.get("customer_phone").toString() : null;
            String deliveryAddress = webhookData.get("delivery_address") != null ? webhookData.get("delivery_address").toString() : null;
            Double totalAmount = webhookData.get("total_amount") != null ? Double.valueOf(webhookData.get("total_amount").toString()) : 0.0;
            
            if (externalId == null) {
                log.warn("❌ Webhook do iFood sem ID do pedido");
                return ResponseEntity.status(400).body(Map.of(
                    "status", "error",
                    "message", "ID do pedido obrigatório",
                    "processed", false
                ));
            }
            
            // Criar ExternalOrder
            ExternalOrder externalOrder = ExternalOrder.builder()
                .externalId(externalId)
                .integration(integration)
                .status(mapIFoodStatus(status))
                .customerName(customerName)
                .customerPhone(customerPhone)
                .deliveryAddress(deliveryAddress)
                .totalAmount(java.math.BigDecimal.valueOf(totalAmount))
                .paymentMethod("CREDIT_CARD") // iFood geralmente usa cartão
                .paymentStatus("PENDING")
                .externalCreatedAt(LocalDateTime.now())
                .syncStatus("PENDING")
                .tenantId(integration.getTenantId())
                .build();
            
            // Sincronizar com sistema interno
            ExternalOrder syncedOrder = externalOrderSyncService.syncExternalOrder(externalOrder);
            
            log.info("✅ Pedido do iFood sincronizado: ID externo={}, ID interno={}", 
                    externalId, syncedOrder.getId());
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Pedido do iFood processado com sucesso",
                "externalOrderId", syncedOrder.getId(),
                "processed", true
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao processar webhook do iFood", e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Erro ao processar pedido do iFood",
                "processed", false
            ));
        }
    }

    /**
     * Processar webhook específico do Uber Eats
     */
    private ResponseEntity<?> processUberEatsWebhook(Integration integration, Map<String, Object> webhookData) {
        try {
            log.info("🚗 Processando webhook do Uber Eats para integração: {}", integration.getName());
            
            // Implementação similar ao iFood, mas com campos específicos do Uber Eats
            String externalId = webhookData.get("order_id") != null ? webhookData.get("order_id").toString() : null;
            String status = webhookData.get("state") != null ? webhookData.get("state").toString() : null;
            
            if (externalId == null) {
                log.warn("❌ Webhook do Uber Eats sem ID do pedido");
                return ResponseEntity.status(400).body(Map.of(
                    "status", "error",
                    "message", "ID do pedido obrigatório",
                    "processed", false
                ));
            }
            
            // Criar ExternalOrder para Uber Eats
            ExternalOrder externalOrder = ExternalOrder.builder()
                .externalId(externalId)
                .integration(integration)
                .status(mapUberEatsStatus(status))
                .syncStatus("PENDING")
                .tenantId(integration.getTenantId())
                .build();
            
            // Sincronizar com sistema interno
            ExternalOrder syncedOrder = externalOrderSyncService.syncExternalOrder(externalOrder);
            
            log.info("✅ Pedido do Uber Eats sincronizado: ID externo={}, ID interno={}", 
                    externalId, syncedOrder.getId());
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Pedido do Uber Eats processado com sucesso",
                "externalOrderId", syncedOrder.getId(),
                "processed", true
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao processar webhook do Uber Eats", e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Erro ao processar pedido do Uber Eats",
                "processed", false
            ));
        }
    }

    /**
     * Processar webhook específico do WhatsApp
     */
    private ResponseEntity<?> processWhatsAppWebhook(Integration integration, Map<String, Object> webhookData) {
        try {
            log.info("💬 Processando webhook do WhatsApp para integração: {}", integration.getName());
            
            // Implementação para WhatsApp Business API
            String messageId = webhookData.get("id") != null ? webhookData.get("id").toString() : null;
            String status = webhookData.get("status") != null ? webhookData.get("status").toString() : null;
            
            if (messageId == null) {
                log.warn("❌ Webhook do WhatsApp sem ID da mensagem");
                return ResponseEntity.status(400).body(Map.of(
                    "status", "error",
                    "message", "ID da mensagem obrigatório",
                    "processed", false
                ));
            }
            
            // Para WhatsApp, pode ser uma mensagem de pedido ou status
            log.info("✅ Mensagem do WhatsApp processada: ID={}, Status={}", messageId, status);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Mensagem do WhatsApp processada com sucesso",
                "messageId", messageId,
                "processed", true
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao processar webhook do WhatsApp", e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Erro ao processar mensagem do WhatsApp",
                "processed", false
            ));
        }
    }

    /**
     * Processar webhook genérico
     */
    private ResponseEntity<?> processGenericWebhook(Integration integration, Map<String, Object> webhookData) {
        try {
            log.info("🔧 Processando webhook genérico para integração: {}", integration.getName());
            
            // Implementação genérica para outras plataformas
            String externalId = webhookData.get("id") != null ? webhookData.get("id").toString() : 
                               webhookData.get("external_id") != null ? webhookData.get("external_id").toString() : null;
            
            if (externalId == null) {
                log.warn("❌ Webhook genérico sem ID externo");
                return ResponseEntity.status(400).body(Map.of(
                    "status", "error",
                    "message", "ID externo obrigatório",
                    "processed", false
                ));
            }
            
            log.info("✅ Webhook genérico processado: ID={}", externalId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Webhook genérico processado com sucesso",
                "externalId", externalId,
                "processed", true
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao processar webhook genérico", e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Erro ao processar webhook genérico",
                "processed", false
            ));
        }
    }

    /**
     * Mapear status do iFood para ExternalOrderStatus
     */
    private ExternalOrder.ExternalOrderStatus mapIFoodStatus(String ifoodStatus) {
        if (ifoodStatus == null) return ExternalOrder.ExternalOrderStatus.PENDING;
        
        switch (ifoodStatus.toLowerCase()) {
            case "pending": return ExternalOrder.ExternalOrderStatus.PENDING;
            case "confirmed": return ExternalOrder.ExternalOrderStatus.CONFIRMED;
            case "preparing": return ExternalOrder.ExternalOrderStatus.PREPARING;
            case "ready": return ExternalOrder.ExternalOrderStatus.READY;
            case "out_for_delivery": return ExternalOrder.ExternalOrderStatus.OUT_FOR_DELIVERY;
            case "delivered": return ExternalOrder.ExternalOrderStatus.DELIVERED;
            case "cancelled": return ExternalOrder.ExternalOrderStatus.CANCELLED;
            case "refunded": return ExternalOrder.ExternalOrderStatus.REFUNDED;
            default: return ExternalOrder.ExternalOrderStatus.PENDING;
        }
    }

    /**
     * Mapear status do Uber Eats para ExternalOrderStatus
     */
    private ExternalOrder.ExternalOrderStatus mapUberEatsStatus(String uberStatus) {
        if (uberStatus == null) return ExternalOrder.ExternalOrderStatus.PENDING;
        
        switch (uberStatus.toLowerCase()) {
            case "placed": return ExternalOrder.ExternalOrderStatus.PENDING;
            case "confirmed": return ExternalOrder.ExternalOrderStatus.CONFIRMED;
            case "preparing": return ExternalOrder.ExternalOrderStatus.PREPARING;
            case "ready_for_pickup": return ExternalOrder.ExternalOrderStatus.READY;
            case "out_for_delivery": return ExternalOrder.ExternalOrderStatus.OUT_FOR_DELIVERY;
            case "delivered": return ExternalOrder.ExternalOrderStatus.DELIVERED;
            case "cancelled": return ExternalOrder.ExternalOrderStatus.CANCELLED;
            case "refunded": return ExternalOrder.ExternalOrderStatus.REFUNDED;
            default: return ExternalOrder.ExternalOrderStatus.PENDING;
        }
    }

    /**
     * Health check para webhooks
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "Integration webhook service is running",
            "timestamp", System.currentTimeMillis()
        ));
    }
}
