package com.vynlotaste.webhook;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final WebhookConfigRepository webhookConfigRepository;
    
    @Retryable(
        retryFor = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    public void sendWebhook(String eventType, Object payload) {
        List<WebhookConfig> configs = webhookConfigRepository.findByEventTypeAndActive(eventType, true);
        
        for (WebhookConfig config : configs) {
            try {
                sendWebhookToEndpoint(config, eventType, payload);
            } catch (Exception e) {
                log.error("Failed to send webhook to {}: {}", config.getUrl(), e.getMessage());
                logWebhookFailure(config, eventType, payload, e);
            }
        }
    }
    
    private void sendWebhookToEndpoint(WebhookConfig config, String eventType, Object payload) throws Exception {
        WebhookPayload webhookPayload = WebhookPayload.builder()
            .eventType(eventType)
            .timestamp(LocalDateTime.now())
            .data(payload)
            .build();
        
        String jsonPayload = objectMapper.writeValueAsString(webhookPayload);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("X-Webhook-Event", eventType);
        headers.set("X-Webhook-Signature", generateSignature(jsonPayload, config.getSecret()));
        
        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            config.getUrl(),
            HttpMethod.POST,
            request,
            String.class
        );
        
        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("Webhook sent successfully to {}: {}", config.getUrl(), eventType);
            logWebhookSuccess(config, eventType, payload);
        } else {
            throw new RuntimeException("Webhook failed with status: " + response.getStatusCode());
        }
    }
    
    private String generateSignature(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return "sha256=" + Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to generate webhook signature", e);
        }
    }
    
    private void logWebhookSuccess(WebhookConfig config, String eventType, Object payload) {
        Map<String, Object> logData = new HashMap<>();
        logData.put("webhookUrl", config.getUrl());
        logData.put("eventType", eventType);
        logData.put("status", "SUCCESS");
        logData.put("timestamp", LocalDateTime.now());
        
        log.info("WEBHOOK_SUCCESS: {}", logData);
    }
    
    private void logWebhookFailure(WebhookConfig config, String eventType, Object payload, Exception error) {
        Map<String, Object> logData = new HashMap<>();
        logData.put("webhookUrl", config.getUrl());
        logData.put("eventType", eventType);
        logData.put("status", "FAILED");
        logData.put("error", error.getMessage());
        logData.put("timestamp", LocalDateTime.now());
        
        log.error("WEBHOOK_FAILURE: {}", logData);
    }
}