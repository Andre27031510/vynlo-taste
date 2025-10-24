package com.vynlotaste.controller;

import com.vynlotaste.dto.payment.PaymentWebhookDto;
import com.vynlotaste.service.PaymentWebhookService;
import com.vynlotaste.service.WebhookValidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller para webhooks de pagamento
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@RestController
@RequestMapping("/api/webhooks/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentWebhookController {

    private final PaymentWebhookService paymentWebhookService;
    private final WebhookValidationService webhookValidationService;

    /**
     * Webhook genérico para qualquer provedor
     * ✅ FASE 4: Com validação de assinatura e timestamp
     */
    @PostMapping("/{provider}")
    public ResponseEntity<?> handleWebhook(
            @PathVariable String provider,
            @RequestHeader(value = "X-Signature", required = false) String signature,
            @RequestHeader(value = "X-Timestamp", required = false) Long timestamp,
            @RequestBody PaymentWebhookDto webhook) {
        
        log.info("🔔 Webhook recebido do provedor: {} - Status: {}", provider, webhook.getStatus());
        
        try {
            // ✅ FASE 4: Validar webhook se signature e timestamp fornecidos
            if (signature != null && timestamp != null) {
                String payload = convertToJsonString(webhook);
                boolean isValid = webhookValidationService.validateWebhook(provider, signature, payload, timestamp);
                
                if (!isValid) {
                    log.warn("❌ Webhook inválido do provedor: {} - assinatura ou timestamp inválidos", provider);
                    return ResponseEntity.status(401).body(Map.of(
                        "status", "error",
                        "message", "Webhook inválido - assinatura ou timestamp inválidos",
                        "processed", false
                    ));
                }
                
                log.info("✅ Webhook validado com sucesso para provedor: {}", provider);
            } else {
                log.warn("⚠️ Webhook sem validação de segurança do provedor: {}", provider);
            }
            
            // Processar webhook
            PaymentWebhookService.PaymentResult result = paymentWebhookService.processWebhook(provider, webhook);
            
            if (result.isSuccess()) {
                log.info("✅ Webhook processado com sucesso: {}", result.getTransactionId());
                return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Webhook processado com sucesso",
                    "transactionId", result.getTransactionId(),
                    "processed", true
                ));
            } else {
                log.warn("⚠️ Webhook processado com erro: {}", result.getErrorMessage());
                return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", result.getErrorMessage(),
                    "processed", false
                ));
            }
            
        } catch (Exception e) {
            log.error("❌ Erro ao processar webhook do provedor: {}", provider, e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Erro interno do servidor",
                "processed", false
            ));
        }
    }

    /**
     * Webhook específico para Stone
     */
    @PostMapping("/stone")
    public ResponseEntity<?> handleStoneWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("stone", null, null, webhook);
    }

    /**
     * Webhook específico para Cielo
     */
    @PostMapping("/cielo")
    public ResponseEntity<?> handleCieloWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("cielo", null, null, webhook);
    }

    /**
     * Webhook específico para Rede
     */
    @PostMapping("/rede")
    public ResponseEntity<?> handleRedeWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("rede", null, null, webhook);
    }

    /**
     * Webhook específico para PagSeguro
     */
    @PostMapping("/pagseguro")
    public ResponseEntity<?> handlePagSeguroWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("pagseguro", null, null, webhook);
    }

    /**
     * Webhook específico para PIX
     */
    @PostMapping("/pix")
    public ResponseEntity<?> handlePixWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("pix", null, null, webhook);
    }

    /**
     * Health check para webhooks
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "Webhook service is running",
            "timestamp", System.currentTimeMillis()
        ));
    }

    /**
     * Teste de webhook
     */
    @PostMapping("/test")
    public ResponseEntity<?> testWebhook(@RequestBody Map<String, Object> testData) {
        log.info("🧪 Teste de webhook recebido: {}", testData);
        
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Webhook de teste processado",
            "receivedData", testData,
            "timestamp", System.currentTimeMillis()
        ));
    }

    /**
     * Converter PaymentWebhookDto para JSON string
     */
    private String convertToJsonString(PaymentWebhookDto webhook) {
        // Implementação simples - em produção usar ObjectMapper
        return String.format(
            "{\"transactionId\":\"%s\",\"status\":\"%s\",\"amount\":%s,\"method\":\"%s\",\"orderId\":\"%s\"}",
            webhook.getTransactionId(),
            webhook.getStatus(),
            webhook.getAmount(),
            webhook.getMethod(),
            webhook.getOrderId()
        );
    }
}
