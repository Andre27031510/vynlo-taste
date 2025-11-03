package com.vynlotaste.config;
// touch: redeploy note (commit 0cc13bc, e32a9a9) - comentário leve sem impacto funcional

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.Tenant;
import com.vynlotaste.entity.UserRole;
import com.vynlotaste.repository.TenantRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Filtro JWT customizado para validação de tokens Firebase
 * Integra autenticação Firebase com Spring Security
 * 
 * MULTI-TENANCY:
 * - Extrai tenantId do JWT e seta no TenantContext
 * - Super Admins: tenantId = null (acesso global)
 * - Clientes normais: tenantId extraído do banco (via firebaseUid)
 * 
 * FLUXO:
 * 1. Validar token Firebase
 * 2. Extrair role (SUPER_ADMIN, ADMIN, etc)
 * 3. Se Super Admin: TenantContext.setIsSuperAdmin(true)
 * 4. Se cliente: Buscar tenant por firebaseUid → TenantContext.setCurrentTenantId()
 * 5. Criar authentication Spring Security
 * 6. Finally: TenantContext.clear()
 * 
 * @version 2.0.0 - Multi-Tenancy Support
 * @modified 2025-10-17
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Autowired(required = false)  // Opcional: pode não existir na fase de setup
    private TenantRepository tenantRepository;
    
    @Autowired(required = false)  // Opcional: Firebase pode não estar inicializado
    private FirebaseAuth firebaseAuth;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        
        // Skip authentication for public endpoints
        if (isPublicEndpoint(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ THREAD-SAFE: Garantir limpeza do contexto SEMPRE
        try {
            String token = extractTokenFromRequest(request);
            
            // Apenas tenta autenticar se houver token
            if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                authenticateToken(token, request);
            }
            
            // Processar requisição
            filterChain.doFilter(request, response);
            
        } catch (Exception e) {
            // Token inválido ou erro de autenticação
            logger.warn("Erro na autenticação: {} [URI={}] - limpando contextos", e.getMessage(), requestURI);
            
            // Limpar TODOS os contextos
            SecurityContextHolder.clearContext();
            TenantContext.clear();
            
            // Re-processar requisição (Spring Security retornará 401)
            filterChain.doFilter(request, response);
            
        } finally {
            // ✅ CRÍTICO: SEMPRE limpar TenantContext (THREAD-SAFE)
            try {
                TenantContext.clear();
                logger.trace("TenantContext limpo após requisição: {} [thread={}]", 
                           requestURI, Thread.currentThread().getName());
            } catch (Exception clearError) {
                logger.error("CRITICAL: Falha ao limpar TenantContext [URI={}, thread={}]", 
                           requestURI, Thread.currentThread().getName(), clearError);
            }
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        
        if (bearerToken != null && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        
        return null;
    }

    private void authenticateToken(String token, HttpServletRequest request) throws Exception {
        // Verificar se Firebase está disponível
        if (firebaseAuth == null) {
            try {
                // Tentar obter do contexto se não foi injetado
                firebaseAuth = FirebaseAuth.getInstance();
            } catch (IllegalStateException e) {
                logger.error("Firebase não está inicializado - não é possível autenticar tokens");
                throw new IllegalStateException("Firebase authentication not available", e);
            }
        }
        
        // Verificar token Firebase
        FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
        String uid = decodedToken.getUid();
        
        // Extrair role do token (custom claims)
        UserRole userRole = extractUserRole(decodedToken);
        
        // ============================================================================
        // MULTI-TENANCY: Extrair e setar tenantId no contexto
        // ============================================================================
        
        // Verificar se é Super Admin (Vynlo Tech)
        Object isSuperAdminClaim = decodedToken.getClaims().get("isSuperAdmin");
        boolean isSuperAdmin = Boolean.TRUE.equals(isSuperAdminClaim);
        
        if (isSuperAdmin || userRole == UserRole.SUPER_ADMIN) {
            // Super Admin: acesso global (sem filtro de tenant)
            TenantContext.setIsSuperAdmin(true);
            logger.info("🔑 Super Admin autenticado: uid={}, access=GLOBAL", sanitizeForLog(uid));
        } else {
            // Cliente normal: buscar tenant_id pelo firebaseUid
            if (tenantRepository != null) {
                Optional<Tenant> tenantOpt = tenantRepository.findByFirebaseUid(uid);
                if (tenantOpt.isPresent()) {
                    Tenant tenant = tenantOpt.get();
                    TenantContext.setCurrentTenantId(tenant.getId());
                    logger.info("👤 Cliente autenticado: uid={}, tenant_id={}, access=RESTRICTED", 
                               sanitizeForLog(uid), tenant.getId());
                } else {
                    // CASO RARO: Usuário existe no Firebase mas não tem tenant no BD
                    // Pode acontecer durante migração ou se tenant foi deletado
                    logger.warn("⚠️ Usuário sem tenant: uid={} - Acesso negado para endpoints protegidos", sanitizeForLog(uid));
                    TenantContext.setCurrentTenantId(null);  // Explicitamente null
                }
            } else {
                // TenantRepository não disponível (fase de setup ou erro de config)
                logger.warn("⚠️ TenantRepository não disponível - Multi-tenancy desabilitado temporariamente");
            }
        }
        
        // ============================================================================
        
        // Criar authorities
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority(userRole.getAuthority())
        );

        // Criar authentication
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(uid, null, authorities);
        
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        
        // Definir no contexto de segurança
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Log de auditoria (resumido)
        logger.debug("✅ Authentication criado: uid={}, role={}", 
                    sanitizeForLog(uid), userRole);
    }

    private UserRole extractUserRole(FirebaseToken token) {
        // PRIORIDADE 1: Verificar se é Super Admin (Vynlo Tech)
        Object isSuperAdmin = token.getClaims().get("isSuperAdmin");
        if (Boolean.TRUE.equals(isSuperAdmin)) {
            logger.info("Super Admin detectado: uid={}", token.getUid());
            return UserRole.SUPER_ADMIN;
        }
        
        // PRIORIDADE 2: Extrair role dos custom claims do Firebase
        Object roleObj = token.getClaims().get("role");
        if (roleObj != null) {
            try {
                String roleStr = roleObj.toString().toUpperCase();
                // Mapear "SUPER_ADMIN" string para enum
                if ("SUPER_ADMIN".equals(roleStr)) {
                    return UserRole.SUPER_ADMIN;
                }
                return UserRole.valueOf(roleStr);
            } catch (IllegalArgumentException e) {
                logger.warn("Role inválido no token: {}", roleObj);
            }
        }
        
        // PRIORIDADE 3: Role padrão se não especificado
        return UserRole.CUSTOMER;
    }

    private boolean isPublicEndpoint(String requestURI) {
        return requestURI.startsWith("/api/v1/auth/") ||
               requestURI.startsWith("/api/v1/test/") ||
               requestURI.startsWith("/api/v1/users/sync-firebase") ||
               requestURI.startsWith("/actuator/") ||
               requestURI.startsWith("/api/v1/public/") ||
               requestURI.equals("/api/v1/health") ||
               requestURI.equals("/favicon.ico");
    }

    /**
     * Sanitiza dados para logs (previne log injection)
     */
    private String sanitizeForLog(String input) {
        if (input == null) return "null";
        // Remove caracteres perigosos para logs
        return input.replaceAll("[\r\n\t]", "_")
                   .replaceAll("[<>\"'&]", "*")
                   .substring(0, Math.min(input.length(), 50)); // Limita tamanho
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