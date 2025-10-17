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
 * SetupAdminController - Configuração Inicial do PRIMEIRO Super Admin
 * 
 * IMPORTANTE: Este controller serve APENAS para criar o PRIMEIRO Super Admin
 * É necessário porque você precisa de um Super Admin para acessar /super-admin
 * e criar outros usuários.
 * 
 * USAR APENAS UMA VEZ:
 * 1. Criar PRIMEIRO Super Admin (admin@vynlotech.com)
 * 2. Fazer login com esse Super Admin
 * 3. Usar /super-admin page para criar outros usuários
 * 4. REMOVER este controller após criar primeiro Super Admin
 * 
 * SEGURANÇA:
 * - Endpoint PÚBLICO (sem autenticação) - NECESSÁRIO para bootstrap
 * - Validação por email específico
 * - Validação por setup key (senha mestra)
 * - Após primeiro uso, DELETAR este arquivo
 * 
 * ENDPOINTS:
 * POST /v1/setup/create-super-admin - Criar PRIMEIRO Super Admin
 * GET /v1/setup/check-user - Verificar custom claims de qualquer usuário
 * 
 * Created: 2025-10-17 12:35 UTC
 * Modified: 2025-10-17 12:45 UTC - Alterado para criar Super Admin (não Admin comum)
 * @author Vynlo Tech
 */
@Slf4j
@RestController
@RequestMapping("/v1/setup")
public class SetupAdminController {

    /**
     * POST /v1/setup/create-super-admin
     * 
     * Cria o PRIMEIRO Super Admin no Firebase com isSuperAdmin=true
     * 
     * USAR APENAS UMA VEZ para criar o primeiro Super Admin!
     * Depois, usar /super-admin page para gerenciar outros usuários.
     * 
     * Body:
     * {
     *   "email": "admin@vynlotech.com",
     *   "password": "SuaSenhaSegura123",
     *   "setupKey": "vynlo-super-admin-2025"
     * }
     * 
     * Setup key é uma "senha mestra" para segurança extra
     */
    @PostMapping("/create-super-admin")
    public ResponseEntity<Map<String, Object>> createSuperAdmin(@RequestBody Map<String, Object> requestData) {
        log.warn("⚠️ CRIANDO PRIMEIRO SUPER ADMIN - Este endpoint é TEMPORÁRIO!");
        
        try {
            String email = (String) requestData.get("email");
            String password = (String) requestData.get("password");
            String setupKey = (String) requestData.get("setupKey");
            
            // Validação 1: Email Vynlo Tech
            if (email == null || !email.endsWith("@vynlotech.com")) {
                log.warn("❌ Email deve ser @vynlotech.com: {}", email);
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email deve ser @vynlotech.com (Super Admin é exclusivo Vynlo Tech)"));
            }
            
            // Validação 2: Senha forte
            if (password == null || password.length() < 8) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Senha deve ter no mínimo 8 caracteres"));
            }
            
            // Validação 3: Setup key (segurança mestra)
            if (!"vynlo-super-admin-2025".equals(setupKey)) {
                log.warn("❌ Setup key inválida");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Setup key inválida"));
            }
            
            // Verificar se usuário já existe
            UserRecord existingUser = null;
            try {
                existingUser = FirebaseAuth.getInstance().getUserByEmail(email);
                log.info("ℹ️ Usuário já existe: {}. Apenas atualizando custom claims.", email);
            } catch (FirebaseAuthException e) {
                // Usuário não existe - criar novo
                log.info("Criando novo usuário Super Admin: {}", email);
            }
            
            UserRecord userRecord;
            
            if (existingUser != null) {
                // Usuário existe - apenas atualizar claims
                userRecord = existingUser;
            } else {
                // Criar novo usuário Super Admin
                UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(email)
                    .setPassword(password)
                    .setDisplayName("Super Admin - Vynlo Tech")
                    .setEmailVerified(true);
                
                userRecord = FirebaseAuth.getInstance().createUser(request);
            }
            
            // Definir custom claims SUPER ADMIN
            Map<String, Object> claims = new HashMap<>();
            claims.put("isSuperAdmin", true);  // ✅ SUPER ADMIN (acesso total)
            claims.put("role", "ADMIN");
            claims.put("companyName", "Vynlo Tech");
            claims.put("vynloProduct", "ALL");  // Super Admin tem acesso a TODOS produtos
            claims.put("level", "SUPER_ADMIN");
            claims.put("permissions", List.of("all", "super-admin", "manage-clients"));
            claims.put("setupDate", System.currentTimeMillis());
            
            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);
            
            log.info("✅ SUPER ADMIN CRIADO COM SUCESSO!");
            log.info("   Email: {}", email);
            log.info("   UID: {}", userRecord.getUid());
            log.info("   isSuperAdmin: true");
            
            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Super Admin criado/configurado com sucesso!");
            response.put("email", email);
            response.put("uid", userRecord.getUid());
            response.put("isSuperAdmin", true);
            response.put("accessTo", List.of(
                "/super-admin (Gerenciar clientes)",
                "/dashboard (Vynlo Taste)",
                "Todos produtos Vynlo"
            ));
            response.put("nextSteps", List.of(
                "1. Fazer login no frontend: " + email,
                "2. Acessar /super-admin (gerenciar clientes)",
                "3. Criar outros admins via interface",
                "4. DELETAR SetupAdminController.java (segurança)"
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Erro ao criar Super Admin", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Erro ao criar Super Admin: " + e.getMessage()));
        }
    }
    
    /**
     * GET /v1/setup/check-user?email=usuario@email.com
     * 
     * Verificar se usuário existe no Firebase e quais custom claims tem
     * Útil para debug e validação
     */
    @GetMapping("/check-user")
    public ResponseEntity<Map<String, Object>> checkUser(@RequestParam String email) {
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

