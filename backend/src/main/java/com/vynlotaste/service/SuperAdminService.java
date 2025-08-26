package com.vynlotaste.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.ExportedUserRecord;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SuperAdminService {

    public Map<String, Object> createClient(String companyName, String adminEmail, 
                                          String adminPassword, List<String> permissions) {
        try {
            // Criar usuário admin do cliente
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(adminEmail)
                .setPassword(adminPassword)
                .setDisplayName("Admin - " + companyName)
                .setEmailVerified(true);

            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

            // Definir claims personalizados
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "admin");
            claims.put("permissions", permissions);
            claims.put("companyName", companyName);
            claims.put("clientType", "RESTAURANT");
            claims.put("isSuperAdmin", false);
            claims.put("level", "CLIENT_ADMIN");
            claims.put("createdAt", System.currentTimeMillis());
            claims.put("status", "ACTIVE");

            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);

            // Retornar dados do cliente criado
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("clientId", userRecord.getUid());
            result.put("companyName", companyName);
            result.put("adminEmail", adminEmail);
            result.put("permissions", permissions);
            result.put("createdAt", new Date());

            return result;
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return error;
        }
    }

    public List<Map<String, Object>> getAllClients() {
        List<Map<String, Object>> clients = new ArrayList<>();
        
        try {
            Iterable<ExportedUserRecord> users = FirebaseAuth.getInstance().listUsers(null).getValues();
            
            for (ExportedUserRecord user : users) {
            

                Map<String, Object> claims = user.getCustomClaims();
                
                if (claims != null && "CLIENT_ADMIN".equals(claims.get("level"))) {
                    Map<String, Object> client = new HashMap<>();
                    client.put("id", user.getUid());
                    client.put("companyName", claims.get("companyName"));
                    client.put("adminEmail", user.getEmail());
                    client.put("permissions", claims.get("permissions"));
                    client.put("status", user.isDisabled() ? "SUSPENDED" : "ACTIVE");
                    client.put("createdAt", claims.get("createdAt"));
                    client.put("lastLogin", user.getUserMetadata().getLastSignInTimestamp());
                    
                    clients.add(client);
                }
            }
        } catch (Exception e) {
            // Log error
        }
        
        return clients;
    }

    public boolean updateClientPermissions(String clientId, List<String> permissions) {
        try {
            UserRecord user = FirebaseAuth.getInstance().getUser(clientId);
            Map<String, Object> currentClaims = user.getCustomClaims();
            
            Map<String, Object> newClaims = new HashMap<>(currentClaims);
            newClaims.put("permissions", permissions);
            newClaims.put("lastUpdated", System.currentTimeMillis());
            
            FirebaseAuth.getInstance().setCustomUserClaims(clientId, newClaims);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean suspendClient(String clientId) {
        try {
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(clientId)
                .setDisabled(true);
            FirebaseAuth.getInstance().updateUser(request);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean activateClient(String clientId) {
        try {
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(clientId)
                .setDisabled(false);
            FirebaseAuth.getInstance().updateUser(request);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteClient(String clientId) {
        try {
            FirebaseAuth.getInstance().deleteUser(clientId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Map<String, List<String>> getAvailablePermissions() {
        Map<String, List<String>> permissions = new HashMap<>();
        
        permissions.put("Produtos", Arrays.asList(
            "manage_products", "view_products", "update_prices", "manage_categories"
        ));
        
        permissions.put("Pedidos", Arrays.asList(
            "manage_orders", "view_orders", "process_orders", "cancel_orders"
        ));
        
        permissions.put("Clientes", Arrays.asList(
            "manage_customers", "view_customers", "customer_support"
        ));
        
        permissions.put("Financeiro", Arrays.asList(
            "manage_financial", "view_reports", "export_data", "manage_payments"
        ));
        
        permissions.put("Delivery", Arrays.asList(
            "manage_delivery", "track_orders", "manage_drivers", "delivery_zones"
        ));
        
        permissions.put("Cardápio", Arrays.asList(
            "manage_menu", "update_menu", "menu_categories", "special_offers"
        ));
        
        permissions.put("Equipe", Arrays.asList(
            "manage_team", "view_performance", "manage_roles", "staff_reports"
        ));
        
        permissions.put("Sistema", Arrays.asList(
            "system_settings", "view_analytics", "backup_data", "integrations"
        ));
        
        return permissions;
    }
}