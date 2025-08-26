package com.vynlotaste.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.ExportedUserRecord;
import java.util.*;

@RestController
@RequestMapping("/api/v1/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    @GetMapping("/admins")
    public ResponseEntity<List<Map<String, Object>>> getAllAdmins() {
        try {
            List<Map<String, Object>> admins = new ArrayList<>();
            
            // Listar todos os usuários admin
            Iterable<ExportedUserRecord> users = FirebaseAuth.getInstance().listUsers(null).getValues();
            
            for (ExportedUserRecord user : users) {
                Map<String, Object> claims = user.getCustomClaims();
                if (claims != null && "admin".equals(claims.get("role"))) {
                    Map<String, Object> adminInfo = new HashMap<>();
                    adminInfo.put("uid", user.getUid());
                    adminInfo.put("email", user.getEmail());
                    adminInfo.put("displayName", user.getDisplayName());
                    adminInfo.put("permissions", claims.get("permissions"));
                    adminInfo.put("level", claims.get("level"));
                    adminInfo.put("assignedBy", claims.get("assignedBy"));
                    admins.add(adminInfo);
                }
            }
            
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/assign-permissions")
    public ResponseEntity<String> assignPermissions(
            @RequestParam String adminUid,
            @RequestBody List<String> permissions) {
        try {
            // Obter claims atuais
            UserRecord user = FirebaseAuth.getInstance().getUser(adminUid);
            Map<String, Object> currentClaims = user.getCustomClaims();
            
            // Atualizar permissões
            Map<String, Object> newClaims = new HashMap<>(currentClaims);
            newClaims.put("permissions", permissions);
            newClaims.put("lastUpdated", System.currentTimeMillis());
            
            FirebaseAuth.getInstance().setCustomUserClaims(adminUid, newClaims);
            
            return ResponseEntity.ok("Permissões atualizadas com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin(@RequestBody Map<String, Object> adminData) {
        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail((String) adminData.get("email"))
                .setPassword((String) adminData.get("password"))
                .setDisplayName((String) adminData.get("displayName"))
                .setEmailVerified(true);

            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

            // Definir permissões do admin
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "admin");
            claims.put("permissions", adminData.get("permissions"));
            claims.put("isSuperAdmin", false);
            claims.put("level", "ADMIN");
            claims.put("assignedBy", adminData.get("assignedBy"));
            claims.put("createdAt", System.currentTimeMillis());

            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);

            return ResponseEntity.ok("Admin criado: " + userRecord.getUid());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove-admin/{adminUid}")
    public ResponseEntity<String> removeAdmin(@PathVariable String adminUid) {
        try {
            FirebaseAuth.getInstance().deleteUser(adminUid);
            return ResponseEntity.ok("Admin removido com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @GetMapping("/permissions/available")
    public ResponseEntity<List<String>> getAvailablePermissions() {
        List<String> permissions = Arrays.asList(
            "manage_products",
            "manage_orders", 
            "manage_customers",
            "view_reports",
            "manage_financial",
            "manage_delivery",
            "manage_menu",
            "manage_team",
            "system_settings",
            "view_analytics"
        );
        return ResponseEntity.ok(permissions);
    }
}