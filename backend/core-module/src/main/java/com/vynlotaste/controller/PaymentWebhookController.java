package com.vynlotaste.controller;

import com.vynlotaste.dto.payment.PaymentWebhookDto;
import com.vynlotaste.service.PaymentWebhookService;
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

    /**
     * Webhook genérico para qualquer provedor
     */
    @PostMapping("/{provider}")
    public ResponseEntity<?> handleWebhook(
            @PathVariable String provider,
            @RequestBody PaymentWebhookDto webhook) {
        
        log.info("🔔 Webhook recebido do provedor: {} - Status: {}", provider, webhook.getStatus());
        
        try {
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
        return handleWebhook("stone", webhook);
    }

    /**
     * Webhook específico para Cielo
     */
    @PostMapping("/cielo")
    public ResponseEntity<?> handleCieloWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("cielo", webhook);
    }

    /**
     * Webhook específico para Rede
     */
    @PostMapping("/rede")
    public ResponseEntity<?> handleRedeWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("rede", webhook);
    }

    /**
     * Webhook específico para PagSeguro
     */
    @PostMapping("/pagseguro")
    public ResponseEntity<?> handlePagSeguroWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("pagseguro", webhook);
    }

    /**
     * Webhook específico para PIX
     */
    @PostMapping("/pix")
    public ResponseEntity<?> handlePixWebhook(@RequestBody PaymentWebhookDto webhook) {
        return handleWebhook("pix", webhook);
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
}
