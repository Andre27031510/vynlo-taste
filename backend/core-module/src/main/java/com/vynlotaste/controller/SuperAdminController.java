package com.vynlotaste.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * ============================================================================
 * Controller para Super Admin - Gestão de clientes
 * ============================================================================
 * 
 * ENDPOINTS:
 * GET    /v1/super-admin/clients         → Listar todos os clientes
 * POST   /v1/super-admin/clients         → Criar novo cliente
 * PUT    /v1/super-admin/clients/{uid}    → Atualizar cliente
 * GET    /v1/super-admin/clients/{uid}    → Buscar cliente por UID
 * PUT    /v1/super-admin/clients/{uid}/set-product → Atualizar produto do usuário
 * 
 * PERMISSÕES: Apenas SUPER_ADMIN pode acessar
 * 
 * @version 1.0.0
 * @author Vynlo Tech
 * ============================================================================
 */
@Slf4j
@RestController
@RequestMapping("/v1/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    /**
     * PUT /v1/super-admin/clients/{uid}/set-product
     * Atualizar produto (vynloProduct) de um usuário específico
     * Útil para configurar Super Admin para acessar EKKLESIA diretamente
     */
    @PutMapping("/clients/{uid}/set-product")
    public ResponseEntity<Map<String, Object>> setUserProduct(
            @PathVariable String uid,
            @RequestParam String vynloProduct) {
        try {
            // Buscar usuário no Firebase
            UserRecord userRecord = FirebaseAuth.getInstance().getUser(uid);
            
            // Extrair custom claims atuais
            Map<String, Object> currentClaims = userRecord.getCustomClaims();
            if (currentClaims == null) {
                currentClaims = new HashMap<>();
            }
            
            // Atualizar vynloProduct
            Map<String, Object> updatedClaims = new HashMap<>(currentClaims);
            updatedClaims.put("vynloProduct", vynloProduct.toUpperCase());
            updatedClaims.put("updatedAt", System.currentTimeMillis());
            
            // Aplicar custom claims atualizados
            FirebaseAuth.getInstance().setCustomUserClaims(uid, updatedClaims);
            
            log.info("✅ vynloProduct atualizado para usuário {}: {}", uid, vynloProduct);
            
            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Produto atualizado com sucesso");
            response.put("uid", uid);
            response.put("vynloProduct", vynloProduct.toUpperCase());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar produto do usuário: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erro ao atualizar produto: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/clients/{uid}")
    public ResponseEntity<Map<String, Object>> getClient(@PathVariable String uid) {
        try {
            UserRecord user = FirebaseAuth.getInstance().getUser(uid);
            Map<String, Object> client = new HashMap<>();
            client.put("uid", user.getUid());
            client.put("email", user.getEmail());
            client.put("displayName", user.getDisplayName());
            client.put("disabled", user.isDisabled());
            client.put("claims", user.getCustomClaims());
            
            return ResponseEntity.ok(client);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erro ao buscar cliente: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
