package com.vynlotaste.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SetupAdminController - Configuração Inicial de Admin
 * 
 * IMPORTANTE: Este é um controller TEMPORÁRIO para setup inicial
 * Adiciona custom claims (role) a usuários Firebase existentes
 * 
 * USAR APENAS UMA VEZ para configurar admin@vynlotech.com
 * Depois deste setup inicial, usar SuperAdmin para gerenciar outros usuários
 * 
 * SEGURANÇA:
 * - Endpoint PÚBLICO (sem autenticação) MAS:
 * - Apenas funciona para email específico: admin@vynlotech.com
 * - Hardcoded para ADMIN role apenas
 * - Após uso, REMOVER este controller ou adicionar @PreAuthorize
 * 
 * ENDPOINTS:
 * POST /v1/setup/admin - Configurar role ADMIN para admin@vynlotech.com
 * 
 * Created: 2025-10-17 12:35 UTC
 * @author Vynlo Tech
 */
@Slf4j
@RestController
@RequestMapping("/v1/setup")
public class SetupAdminController {

    /**
     * POST /v1/setup/admin
     * 
     * Adiciona custom claim "role": "ADMIN" ao usuário admin@vynlotech.com
     * 
     * USAR APENAS UMA VEZ!
     * 
     * Body:
     * {
     *   "email": "admin@vynlotech.com",
     *   "setupKey": "vynlo-setup-2025"
     * }
     */
    @PostMapping("/admin")
    public ResponseEntity<Map<String, Object>> setupAdmin(@RequestBody Map<String, Object> requestData) {
        log.warn("⚠️ Setup Admin endpoint chamado - Este é um endpoint TEMPORÁRIO!");
        
        try {
            String email = (String) requestData.get("email");
            String setupKey = (String) requestData.get("setupKey");
            
            // Validação 1: Apenas admin@vynlotech.com
            if (!"admin@vynlotech.com".equals(email)) {
                log.warn("❌ Tentativa de setup com email inválido: {}", email);
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Este endpoint é apenas para admin@vynlotech.com"));
            }
            
            // Validação 2: Setup key (segurança básica)
            if (!"vynlo-setup-2025".equals(setupKey)) {
                log.warn("❌ Setup key inválida");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Setup key inválida"));
            }
            
            // Buscar usuário no Firebase
            UserRecord userRecord;
            try {
                userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            } catch (FirebaseAuthException e) {
                log.error("❌ Usuário não encontrado no Firebase: {}", email, e);
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Usuário não encontrado no Firebase. Criar usuário primeiro."));
            }
            
            // Definir custom claims ADMIN
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "ADMIN");
            claims.put("companyName", "Vynlo Tech");
            claims.put("vynloProduct", "TASTE");
            claims.put("clientType", "RESTAURANT");
            claims.put("isSuperAdmin", false);  // Admin normal, não Super Admin
            claims.put("level", "ADMIN");
            claims.put("permissions", List.of("all"));
            claims.put("setupDate", System.currentTimeMillis());
            
            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);
            
            log.info("✅ Custom claims ADMIN configurados para: {}", email);
            log.info("   UID: {}", userRecord.getUid());
            log.info("   Role: ADMIN");
            
            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Role ADMIN configurada com sucesso!");
            response.put("email", email);
            response.put("uid", userRecord.getUid());
            response.put("role", "ADMIN");
            response.put("nextSteps", List.of(
                "1. Fazer logout no frontend",
                "2. Fazer login novamente (novo token com role ADMIN)",
                "3. Acessar /dashboard (já terá permissões)",
                "4. REMOVER este controller (SetupAdminController.java) em produção"
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Erro ao configurar admin", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Erro ao configurar admin: " + e.getMessage()));
        }
    }
    
    /**
     * GET /v1/setup/check-admin?email=admin@vynlotech.com
     * 
     * Verificar se usuário já tem custom claims configurados
     */
    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Object>> checkAdmin(@RequestParam String email) {
        try {
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            Map<String, Object> claims = userRecord.getCustomClaims();
            
            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("uid", userRecord.getUid());
            response.put("hasCustomClaims", claims != null && !claims.isEmpty());
            response.put("claims", claims != null ? claims : Map.of());
            response.put("role", claims != null ? claims.get("role") : "CUSTOMER (padrão)");
            
            return ResponseEntity.ok(response);
            
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Usuário não encontrado: " + email));
        }
    }
}

