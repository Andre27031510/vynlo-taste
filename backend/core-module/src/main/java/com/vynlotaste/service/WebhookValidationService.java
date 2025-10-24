package com.vynlotaste.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;

/**
 * ✅ FASE 4: Serviço de Validação de Webhooks
 * Implementa validação de assinatura para webhooks de provedores de pagamento
 * 
 * Funcionalidades:
 * - Validação de assinatura HMAC-SHA256
 * - Validação de timestamp para evitar replay attacks
 * - Suporte a múltiplos provedores
 * - Configuração via properties
 * 
 * NOTA: Implementação segura para produção - secrets configurados via environment variables
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookValidationService {

    @Value("${webhook.stone.secret:}")
    private String stoneWebhookSecret;

    @Value("${webhook.cielo.secret:}")
    private String cieloWebhookSecret;

    @Value("${webhook.rede.secret:}")
    private String redeWebhookSecret;

    @Value("${webhook.pagseguro.secret:}")
    private String pagseguroWebhookSecret;

    @Value("${webhook.pix.secret:}")
    private String pixWebhookSecret;

    @Value("${webhook.max-age-seconds:300}")
    private long maxAgeSeconds;

    /**
     * Validar webhook de provedor
     */
    public boolean validateWebhook(String provider, String signature, String payload, long timestamp) {
        try {
            log.debug("🔍 Validando webhook do provedor: {}", provider);

            // 1. Verificar timestamp (evitar replay attacks)
            if (!isTimestampValid(timestamp)) {
                log.warn("⚠️ Timestamp inválido para webhook do provedor: {} - timestamp: {}", provider, timestamp);
                return false;
            }

            // 2. Obter secret do provedor
            String secret = getProviderSecret(provider);
            if (secret == null || secret.trim().isEmpty()) {
                log.warn("⚠️ Secret não configurado para provedor: {}", provider);
                return false;
            }

            // 3. Validar assinatura
            boolean isValid = validateSignature(signature, payload, secret, provider);
            
            if (isValid) {
                log.debug("✅ Webhook validado com sucesso para provedor: {}", provider);
            } else {
                log.warn("❌ Assinatura inválida para webhook do provedor: {}", provider);
            }

            return isValid;

        } catch (Exception e) {
            log.error("❌ Erro ao validar webhook do provedor: {}", provider, e);
            return false;
        }
    }

    /**
     * Validar timestamp para evitar replay attacks
     */
    private boolean isTimestampValid(long timestamp) {
        long currentTime = System.currentTimeMillis() / 1000;
        long age = currentTime - timestamp;
        
        return age >= 0 && age <= maxAgeSeconds;
    }

    /**
     * Obter secret do provedor
     */
    private String getProviderSecret(String provider) {
        switch (provider.toLowerCase()) {
            case "stone":
                return stoneWebhookSecret;
            case "cielo":
                return cieloWebhookSecret;
            case "rede":
                return redeWebhookSecret;
            case "pagseguro":
                return pagseguroWebhookSecret;
            case "pix":
                return pixWebhookSecret;
            default:
                log.warn("⚠️ Provedor não suportado: {}", provider);
                return null;
        }
    }

    /**
     * Validar assinatura HMAC-SHA256
     */
    private boolean validateSignature(String signature, String payload, String secret, String provider) {
        try {
            // Gerar assinatura esperada
            String expectedSignature = generateSignature(payload, secret, provider);
            
            // Comparar assinaturas (timing-safe)
            return constantTimeEquals(signature, expectedSignature);

        } catch (Exception e) {
            log.error("❌ Erro ao validar assinatura para provedor: {}", provider, e);
            return false;
        }
    }

    /**
     * Gerar assinatura HMAC-SHA256
     */
    private String generateSignature(String payload, String secret, String provider) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            
            byte[] signatureBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            
            // Formato da assinatura varia por provedor
            switch (provider.toLowerCase()) {
                case "stone":
                case "cielo":
                case "rede":
                    return "sha256=" + Base64.getEncoder().encodeToString(signatureBytes);
                case "pagseguro":
                    return Base64.getEncoder().encodeToString(signatureBytes);
                case "pix":
                    return Base64.getEncoder().encodeToString(signatureBytes);
                default:
                    return Base64.getEncoder().encodeToString(signatureBytes);
            }

        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("❌ Erro ao gerar assinatura HMAC-SHA256: {}", e.getMessage());
            throw new RuntimeException("Erro ao gerar assinatura", e);
        }
    }

    /**
     * Comparação timing-safe para evitar timing attacks
     */
    private boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) {
            return a == b;
        }
        
        if (a.length() != b.length()) {
            return false;
        }
        
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        
        return result == 0;
    }

    /**
     * Validar payload JSON básico
     */
    public boolean validatePayloadStructure(Map<String, Object> payload, String provider) {
        try {
            log.debug("🔍 Validando estrutura do payload para provedor: {}", provider);

            // Validações básicas comuns
            if (payload == null || payload.isEmpty()) {
                log.warn("⚠️ Payload vazio para provedor: {}", provider);
                return false;
            }

            // Validações específicas por provedor
            switch (provider.toLowerCase()) {
                case "stone":
                    return validateStonePayload(payload);
                case "cielo":
                    return validateCieloPayload(payload);
                case "rede":
                    return validateRedePayload(payload);
                case "pagseguro":
                    return validatePagSeguroPayload(payload);
                case "pix":
                    return validatePixPayload(payload);
                default:
                    log.warn("⚠️ Validação de payload não implementada para provedor: {}", provider);
                    return true; // Aceitar por padrão
            }

        } catch (Exception e) {
            log.error("❌ Erro ao validar estrutura do payload para provedor: {}", provider, e);
            return false;
        }
    }

    /**
     * Validar payload do Stone
     */
    private boolean validateStonePayload(Map<String, Object> payload) {
        return payload.containsKey("transactionId") && 
               payload.containsKey("status") && 
               payload.containsKey("amount");
    }

    /**
     * Validar payload do Cielo
     */
    private boolean validateCieloPayload(Map<String, Object> payload) {
        return payload.containsKey("PaymentId") && 
               payload.containsKey("Status") && 
               payload.containsKey("Amount");
    }

    /**
     * Validar payload do Rede
     */
    private boolean validateRedePayload(Map<String, Object> payload) {
        return payload.containsKey("tid") && 
               payload.containsKey("status") && 
               payload.containsKey("amount");
    }

    /**
     * Validar payload do PagSeguro
     */
    private boolean validatePagSeguroPayload(Map<String, Object> payload) {
        return payload.containsKey("notificationCode") && 
               payload.containsKey("notificationType");
    }

    /**
     * Validar payload do PIX
     */
    private boolean validatePixPayload(Map<String, Object> payload) {
        return payload.containsKey("endToEndId") && 
               payload.containsKey("status") && 
               payload.containsKey("valor");
    }

    /**
     * Obter configuração de webhook para provedor
     */
    public WebhookConfig getWebhookConfig(String provider) {
        String secret = getProviderSecret(provider);
        
        return WebhookConfig.builder()
            .provider(provider)
            .secret(secret != null && !secret.trim().isEmpty())
            .maxAgeSeconds(maxAgeSeconds)
            .supported(true)
            .build();
    }

    /**
     * Configuração de webhook
     */
    public static class WebhookConfig {
        private String provider;
        private boolean secret;
        private long maxAgeSeconds;
        private boolean supported;

        public static WebhookConfigBuilder builder() {
            return new WebhookConfigBuilder();
        }

        // Getters e setters
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public boolean isSecret() { return secret; }
        public void setSecret(boolean secret) { this.secret = secret; }
        public long getMaxAgeSeconds() { return maxAgeSeconds; }
        public void setMaxAgeSeconds(long maxAgeSeconds) { this.maxAgeSeconds = maxAgeSeconds; }
        public boolean isSupported() { return supported; }
        public void setSupported(boolean supported) { this.supported = supported; }

        public static class WebhookConfigBuilder {
            private String provider;
            private boolean secret;
            private long maxAgeSeconds;
            private boolean supported;

            public WebhookConfigBuilder provider(String provider) { this.provider = provider; return this; }
            public WebhookConfigBuilder secret(boolean secret) { this.secret = secret; return this; }
            public WebhookConfigBuilder maxAgeSeconds(long maxAgeSeconds) { this.maxAgeSeconds = maxAgeSeconds; return this; }
            public WebhookConfigBuilder supported(boolean supported) { this.supported = supported; return this; }

            public WebhookConfig build() {
                WebhookConfig config = new WebhookConfig();
                config.setProvider(provider);
                config.setSecret(secret);
                config.setMaxAgeSeconds(maxAgeSeconds);
                config.setSupported(supported);
                return config;
            }
        }
    }
}
