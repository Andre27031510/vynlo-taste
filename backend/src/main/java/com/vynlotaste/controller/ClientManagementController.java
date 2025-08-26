package com.vynlotaste.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.vynlotaste.service.SuperAdminService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.ExportedUserRecord;
import java.util.*;

@RestController
@RequestMapping("/api/v1/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class ClientManagementController {

    @PostMapping("/create-client")
    public ResponseEntity<Map<String, Object>> createClient(@RequestBody Map<String, Object> clientData) {
        try {
            // Criar admin do cliente
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail((String) clientData.get("adminEmail"))
                .setPassword((String) clientData.get("adminPassword"))
                .setDisplayName("Admin - " + clientData.get("companyName"))
                .setEmailVerified(true);

            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

            // Definir permissões específicas do cliente
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "admin");
            claims.put("permissions", clientData.get("permissions"));
            claims.put("companyName", clientData.get("companyName"));
            claims.put("clientType", "RESTAURANT");
            claims.put("isSuperAdmin", false);
            claims.put("level", "CLIENT_ADMIN");
            claims.put("createdAt", System.currentTimeMillis());
            claims.put("createdBy", "SUPER_ADMIN");

            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("clientId", userRecord.getUid());
            response.put("adminEmail", clientData.get("adminEmail"));
            response.put("companyName", clientData.get("companyName"));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erro ao criar cliente: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<List<Map<String, Object>>> getAllClients() {
        try {
            List<Map<String, Object>> clients = new ArrayList<>();
            
            Iterable<ExportedUserRecord> users = FirebaseAuth.getInstance().listUsers(null).getValues();
            
            for (ExportedUserRecord user : users) {
                Map<String, Object> claims = user.getCustomClaims();
                if (claims != null && "CLIENT_ADMIN".equals(claims.get("level"))) {
                    Map<String, Object> clientInfo = new HashMap<>();
                    clientInfo.put("id", user.getUid());
                    clientInfo.put("adminEmail", user.getEmail());
                    clientInfo.put("companyName", claims.get("companyName"));
                    clientInfo.put("permissions", claims.get("permissions"));
                    clientInfo.put("createdAt", claims.get("createdAt"));
                    clientInfo.put("status", user.isDisabled() ? "SUSPENDED" : "ACTIVE");
                    clients.add(clientInfo);
                }
            }
            
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/client/{clientId}/permissions")
    public ResponseEntity<String> updateClientPermissions(
            @PathVariable String clientId,
            @RequestBody List<String> permissions) {
        try {
            UserRecord user = FirebaseAuth.getInstance().getUser(clientId);
            Map<String, Object> currentClaims = user.getCustomClaims();
            
            Map<String, Object> newClaims = new HashMap<>(currentClaims);
            newClaims.put("permissions", permissions);
            newClaims.put("lastUpdated", System.currentTimeMillis());
            newClaims.put("updatedBy", "SUPER_ADMIN");
            
            FirebaseAuth.getInstance().setCustomUserClaims(clientId, newClaims);
            
            return ResponseEntity.ok("Permissões atualizadas com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PutMapping("/client/{clientId}/suspend")
    public ResponseEntity<String> suspendClient(@PathVariable String clientId) {
        try {
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(clientId)
                .setDisabled(true);
            
            FirebaseAuth.getInstance().updateUser(request);
            
            return ResponseEntity.ok("Cliente suspenso com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PutMapping("/client/{clientId}/activate")
    public ResponseEntity<String> activateClient(@PathVariable String clientId) {
        try {
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(clientId)
                .setDisabled(false);
            
            FirebaseAuth.getInstance().updateUser(request);
            
            return ResponseEntity.ok("Cliente ativado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @GetMapping("/client-permissions/available")
    public ResponseEntity<Map<String, List<String>>> getAvailableClientPermissions() {
        Map<String, List<String>> permissionGroups = new HashMap<>();
        
        permissionGroups.put("Produtos", Arrays.asList("manage_products", "view_products"));
        permissionGroups.put("Pedidos", Arrays.asList("manage_orders", "view_orders"));
        permissionGroups.put("Clientes", Arrays.asList("manage_customers", "view_customers"));
        permissionGroups.put("Financeiro", Arrays.asList("manage_financial", "view_reports"));
        permissionGroups.put("Delivery", Arrays.asList("manage_delivery", "track_orders"));
        permissionGroups.put("Cardápio", Arrays.asList("manage_menu", "update_prices"));
        permissionGroups.put("Equipe", Arrays.asList("manage_team", "view_performance"));
        permissionGroups.put("Sistema", Arrays.asList("system_settings", "view_analytics"));
        
        return ResponseEntity.ok(permissionGroups);
    }
}