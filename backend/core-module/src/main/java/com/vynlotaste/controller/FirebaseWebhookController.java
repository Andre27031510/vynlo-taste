package com.vynlotaste.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vynlotaste.service.FirebaseUserSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/v1/webhooks")
@RequiredArgsConstructor
public class FirebaseWebhookController {

    private final FirebaseUserSyncService syncService;
    private final ObjectMapper objectMapper;

    @PostMapping("/firebase-auth")
    public ResponseEntity<String> handleFirebaseAuthEvent(@RequestBody String payload) {
        try {
            log.info("🔥 Firebase Auth Webhook recebido");
            
            // Parse do payload do Cloud Functions
            JsonNode rootNode = objectMapper.readTree(payload);
            JsonNode messageNode = rootNode.get("message");
            
            if (messageNode != null && messageNode.has("data")) {
                String encodedData = messageNode.get("data").asText();
                String decodedData = new String(Base64.getDecoder().decode(encodedData));
                
                JsonNode eventData = objectMapper.readTree(decodedData);
                String eventType = eventData.get("eventType").asText();
                JsonNode userData = eventData.get("data");
                
                log.info("Event Type: {}, UID: {}", eventType, userData.get("uid").asText());
                
                if ("providers/firebase.auth/eventTypes/user.create".equals(eventType)) {
                    handleUserCreation(userData);
                } else if ("providers/firebase.auth/eventTypes/user.signIn".equals(eventType)) {
                    handleUserSignIn(userData);
                }
            }
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            log.error("❌ Erro processando webhook Firebase: {}", e.getMessage(), e);
            return ResponseEntity.ok("ERROR"); // Retorna OK para não reprocessar
        }
    }

    private void handleUserCreation(JsonNode userData) {
        try {
            String uid = userData.get("uid").asText();
            String email = userData.has("email") ? userData.get("email").asText() : null;
            String displayName = userData.has("displayName") ? userData.get("displayName").asText() : null;
            boolean emailVerified = userData.has("emailVerified") && userData.get("emailVerified").asBoolean();
            
            log.info("🆕 Webhook Firebase - Novo usuário: {} ({})", email, uid);
            
            if (email != null) {
                syncService.syncFirebaseUserSync(email, uid, displayName, emailVerified);
            }
            
        } catch (Exception e) {
            log.error("❌ Erro processando webhook de criação: {}", e.getMessage(), e);
        }
    }

    private void handleUserSignIn(JsonNode userData) {
        try {
            String uid = userData.get("uid").asText();
            String email = userData.has("email") ? userData.get("email").asText() : null;
            
            log.info("🔐 Webhook Firebase - Login: {} ({})", email, uid);
            
            if (email != null) {
                // Sincronizar assincronamente se necessário
                syncService.syncFirebaseUserAsync(uid);
            }
            
        } catch (Exception e) {
            log.error("❌ Erro processando webhook de login: {}", e.getMessage(), e);
        }
    }
}