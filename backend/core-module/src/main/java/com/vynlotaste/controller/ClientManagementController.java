package com.vynlotaste.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.ExportedUserRecord;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Client Management Controller - Super Admin
 * Commit 4481aaf: Criado para gestão multi-tenant
 * - Criar clientes com vynloProduct (TASTE, EKKLESIA, BOT, etc)
 * - Listar, suspender, ativar clientes
 * - Gerenciar permissões granulares
 * Apenas SUPER_ADMIN pode acessar
 */
@RestController
@RequestMapping("/v1/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class ClientManagementController {

    @PostMapping("/create-client")
    public ResponseEntity<Map<String, Object>> createClient(@RequestBody Map<String, Object> clientData) {
        try {
            // Validações de entrada
            String companyName = (String) clientData.get("companyName");
            String adminEmail = (String) clientData.get("adminEmail");
            String adminPassword = (String) clientData.get("adminPassword");
            String vynloProduct = (String) clientData.get("vynloProduct");
            
            if (companyName == null || companyName.trim().isEmpty()) {
                throw new IllegalArgumentException("Nome da empresa é obrigatório");
            }
            if (adminEmail == null || !adminEmail.contains("@")) {
                throw new IllegalArgumentException("Email inválido");
            }
            if (adminPassword == null || adminPassword.length() < 8) {
                throw new IllegalArgumentException("Senha deve ter no mínimo 8 caracteres");
            }
            if (vynloProduct == null) {
                vynloProduct = "TASTE"; // Default
            }
            
            // Criar admin do cliente
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(adminEmail)
                .setPassword(adminPassword)
                .setDisplayName("Admin - " + companyName)
                .setEmailVerified(true);

            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

            // Definir permissões específicas do cliente (Firebase Custom Claims)
            Map<String, Object> claims = new HashMap<>();
            
            // ✅ OPÇÃO B: Role DINÂMICO (pode ser ADMIN, MANAGER, STAFF, CUSTOMER)
            // Commit 2788a34: Implementado campo "role" dinâmico no formulário Super Admin
            // Commit atual: Adicionado campo "cnpj" (CNPJ da empresa)
            // 
            // ANTES: Role era HARDCODED como "ADMIN" (todos usuários eram admins)
            // DEPOIS: Super Admin ESCOLHE o nível de acesso ao criar usuário
            // 
            // Roles disponíveis:
            // - ADMIN: Acesso total ao sistema do cliente (gerenciar tudo)
            // - MANAGER: Gestão operacional (pedidos, produtos, relatórios)
            // - STAFF: Equipe operacional (apenas executar tarefas)
            // - CUSTOMER: Usuário final (app mobile, fazer pedidos)
            // 
            // Frontend: super-admin/page.tsx tem dropdown com essas opções
            // Validação: Yup schema valida que role seja uma das 4 opções
            // Segurança: Backend valida novamente antes de criar
            String userRole = (String) clientData.getOrDefault("role", "ADMIN");
            
            // Validar role (segurança adicional backend)
            // Se frontend enviar role inválido, usar ADMIN como fallback seguro
            if (!Arrays.asList("ADMIN", "MANAGER", "STAFF", "CUSTOMER").contains(userRole)) {
                userRole = "ADMIN"; // Fallback seguro
            }
            
            claims.put("role", userRole);  // ✅ DINÂMICO (não mais hardcoded como "ADMIN")
            claims.put("companyName", companyName);
            claims.put("vynloProduct", vynloProduct.toUpperCase()); // TASTE, EKKLESIA, BOT, etc
            claims.put("clientType", clientData.getOrDefault("clientType", "RESTAURANT"));
            claims.put("cnpj", clientData.getOrDefault("cnpj", ""));  // ✅ CNPJ da empresa (opcional)
            claims.put("isSuperAdmin", false);  // Super Admin NÃO pode criar outros Super Admins
            claims.put("level", "CLIENT_" + userRole);  // CLIENT_ADMIN, CLIENT_MANAGER, CLIENT_STAFF, CLIENT_CUSTOMER
            claims.put("permissions", clientData.getOrDefault("permissions", List.of("all")));
            claims.put("createdAt", System.currentTimeMillis());
            claims.put("createdBy", "SUPER_ADMIN");
            claims.put("status", "ACTIVE");

            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);

            // Response detalhado
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("clientId", userRecord.getUid());
            response.put("companyName", companyName);
            response.put("adminEmail", adminEmail);
            response.put("vynloProduct", vynloProduct);
            response.put("createdAt", new Date());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erro ao criar cliente: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * PUT /v1/super-admin/clients/{uid}
     * Atualizar dados de um cliente existente
     * 
     * Commit 5d75d82: Implementado endpoint de edição de clientes
     * 
     * PERMITE ATUALIZAR:
     * - companyName (Nome da empresa) → Atualiza também displayName no Firebase
     * - vynloProduct (Produto Vynlo) → Permite migrar cliente entre produtos
     * - role (Nível de acesso) → Promover/rebaixar: ADMIN, MANAGER, STAFF, CUSTOMER
     * - cnpj (CNPJ da empresa) → Compliance fiscal, validado no frontend
     * - clientType (Tipo de cliente) → RESTAURANT, CHURCH, etc
     * 
     * NÃO PERMITE ATUALIZAR (Segurança):
     * - email (fixo após criação) → Identificador único, não pode mudar
     * - password (precisa reset via Firebase Auth) → Segurança, não expor senha
     * 
     * ESTRATÉGIA DE MERGE:
     * - Carrega custom claims atuais do Firebase
     * - Faz merge com novos dados (mantém claims não enviados)
     * - Exemplo: Se não enviar "permissions", mantém o atual
     * 
     * VALIDAÇÕES:
     * - Role deve ser: ADMIN, MANAGER, STAFF, CUSTOMER (validação backend)
     * - Fallback seguro: Se role inválido, não atualiza
     * - CNPJ: Validado no frontend (regex), backend aceita qualquer string
     * 
     * FIREBASE CUSTOM CLAIMS ATUALIZADOS:
     * - companyName: string
     * - vynloProduct: string (uppercase)
     * - role: string (validado)
     * - level: "CLIENT_" + role (ex: CLIENT_ADMIN)
     * - cnpj: string (opcional)
     * - clientType: string
     * - updatedAt: timestamp (auto-adicionado)
     * 
     * RESPOSTA:
     * {
     *   "success": true,
     *   "message": "Cliente atualizado com sucesso",
     *   "uid": "ABC123...",
     *   "updatedFields": ["companyName", "role", "cnpj"]
     * }
     * 
     * USO:
     * PUT /v1/super-admin/clients/ABC123
     * Body: { "companyName": "Novo Nome", "role": "MANAGER", "cnpj": "12.345.678/0001-90" }
     */
    @PutMapping("/clients/{uid}")
    public ResponseEntity<Map<String, Object>> updateClient(
            @PathVariable String uid,
            @RequestBody Map<String, Object> clientData) {
        try {
            // Buscar usuário no Firebase
            UserRecord userRecord = FirebaseAuth.getInstance().getUser(uid);
            
            // Extrair custom claims atuais
            Map<String, Object> currentClaims = userRecord.getCustomClaims();
            if (currentClaims == null) {
                currentClaims = new HashMap<>();
            }
            
            // Atualizar apenas os campos enviados (merge com claims existentes)
            Map<String, Object> updatedClaims = new HashMap<>(currentClaims);
            
            // Atualizar companyName se enviado
            if (clientData.containsKey("companyName")) {
                String companyName = (String) clientData.get("companyName");
                if (companyName != null && !companyName.trim().isEmpty()) {
                    updatedClaims.put("companyName", companyName);
                    
                    // Atualizar displayName também
                    UserRecord.UpdateRequest updateRequest = new UserRecord.UpdateRequest(uid)
                        .setDisplayName("Admin - " + companyName);
                    FirebaseAuth.getInstance().updateUser(updateRequest);
                }
            }
            
            // Atualizar vynloProduct se enviado
            if (clientData.containsKey("vynloProduct")) {
                String vynloProduct = (String) clientData.get("vynloProduct");
                if (vynloProduct != null) {
                    updatedClaims.put("vynloProduct", vynloProduct.toUpperCase());
                }
            }
            
            // Atualizar role se enviado
            if (clientData.containsKey("role")) {
                String role = (String) clientData.get("role");
                if (role != null && Arrays.asList("ADMIN", "MANAGER", "STAFF", "CUSTOMER").contains(role)) {
                    updatedClaims.put("role", role);
                    updatedClaims.put("level", "CLIENT_" + role);
                }
            }
            
            // Atualizar CNPJ se enviado
            if (clientData.containsKey("cnpj")) {
                String cnpj = (String) clientData.get("cnpj");
                updatedClaims.put("cnpj", cnpj != null ? cnpj : "");
            }
            
            // Atualizar clientType se enviado
            if (clientData.containsKey("clientType")) {
                String clientType = (String) clientData.get("clientType");
                if (clientType != null) {
                    updatedClaims.put("clientType", clientType);
                }
            }
            
            // Timestamp de atualização
            updatedClaims.put("updatedAt", System.currentTimeMillis());
            
            // Aplicar custom claims atualizados
            FirebaseAuth.getInstance().setCustomUserClaims(uid, updatedClaims);
            
            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cliente atualizado com sucesso");
            response.put("uid", uid);
            response.put("updatedFields", clientData.keySet());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erro ao atualizar cliente: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
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
                    clientInfo.put("companyName", claims.get("companyName"));
                    clientInfo.put("adminEmail", user.getEmail());
                    clientInfo.put("vynloProduct", claims.getOrDefault("vynloProduct", "TASTE"));
                    clientInfo.put("clientType", claims.getOrDefault("clientType", "RESTAURANT"));
                    clientInfo.put("permissions", claims.get("permissions"));
                    clientInfo.put("status", user.isDisabled() ? "SUSPENDED" : "ACTIVE");
                    clientInfo.put("createdAt", claims.get("createdAt"));
                    clientInfo.put("lastLogin", user.getUserMetadata().getLastSignInTimestamp());
                    clientInfo.put("emailVerified", user.isEmailVerified());
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