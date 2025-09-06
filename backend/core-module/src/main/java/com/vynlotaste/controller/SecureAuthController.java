package com.vynlotaste.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.vynlotaste.entity.UserRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller de autenticação seguro com Firebase
 * Implementa logout seguro e validação de tokens
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = {"https://vynlotaste.com", "https://*.vynlotaste.com"})
public class SecureAuthController {

    private static final Logger logger = LoggerFactory.getLogger(SecureAuthController.class);
    private static final Logger auditLogger = LoggerFactory.getLogger("SECURITY_AUDIT");

    /**
     * Endpoint público para verificação de saúde da autenticação
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("timestamp", System.currentTimeMillis());
        response.put("service", "auth");
        return ResponseEntity.ok(response);
    }

    /**
     * Validar token Firebase
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> request,
                                                           HttpServletRequest httpRequest) {
        try {
            String token = request.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Token é obrigatório"));
            }

            // Verificar token com Firebase
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            Object roleObj = decodedToken.getClaims().get("role");
            
            UserRole userRole = UserRole.CUSTOMER; // Padrão
            if (roleObj != null) {
                try {
                    userRole = UserRole.valueOf(roleObj.toString().toUpperCase());
                } catch (IllegalArgumentException e) {
                    logger.warn("Role inválido no token: {}", roleObj);
                }
            }

            // Log de auditoria
            String clientIp = getClientIpAddress(httpRequest);
            auditLogger.info("TOKEN_VALIDATION uid={} email={} role={} ip={}", 
                           uid, email, userRole, clientIp);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("uid", uid);
            response.put("email", email);
            response.put("role", userRole.name());
            response.put("authorities", userRole.getAuthority());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Erro na validação do token: {}", e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", "Token inválido");
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Logout seguro - invalidar sessão
     */
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request, 
                                                    HttpServletResponse response) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth != null ? auth.getName() : "unknown";
            String clientIp = getClientIpAddress(request);

            // Limpar contexto de segurança
            SecurityContextHolder.clearContext();

            // Log de auditoria
            auditLogger.info("USER_LOGOUT uid={} ip={} timestamp={}", 
                           userId, clientIp, System.currentTimeMillis());

            // Headers de segurança para logout
            response.setHeader("Clear-Site-Data", "\"cache\", \"cookies\", \"storage\"");
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "Logout realizado com sucesso");
            responseBody.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            logger.error("Erro no logout: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Erro interno no logout");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Obter informações do usuário atual
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuário não autenticado"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("uid", auth.getName());
            response.put("authorities", auth.getAuthorities());
            response.put("authenticated", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Erro ao obter usuário atual: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro interno"));
        }
    }

    /**
     * Endpoint para refresh de token (se necessário)
     */
    @PostMapping("/refresh")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> refreshToken(HttpServletRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth != null ? auth.getName() : "unknown";
            String clientIp = getClientIpAddress(request);

            // Log de auditoria
            auditLogger.info("TOKEN_REFRESH uid={} ip={}", userId, clientIp);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token ainda válido");
            response.put("uid", userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Erro no refresh de token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Token inválido"));
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}