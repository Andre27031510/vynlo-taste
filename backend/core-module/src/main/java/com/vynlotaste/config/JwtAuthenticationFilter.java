package com.vynlotaste.config;

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

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        
        // Skip authentication for public endpoints
        if (isPublicEndpoint(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = extractTokenFromRequest(request);
            
            // Apenas tenta autenticar se houver token
            if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                authenticateToken(token, request);
            }
            // Se não houver token, deixa o Spring Security decidir (401 será retornado automaticamente)
        } catch (Exception e) {
            // Token inválido - limpa contexto e deixa Spring Security retornar 401
            logger.warn("Token inválido ou expirado: {} - deixando Spring Security gerenciar", e.getMessage());
            SecurityContextHolder.clearContext();
            TenantContext.clear();  // ✅ Limpar contexto de tenant também
            // NÃO lança exceção - deixa o filtro continuar para que Spring Security retorne 401
        } finally {
            // ✅ CRÍTICO: SEMPRE limpar TenantContext no finally (evitar memory leak)
            // ThreadLocal persiste entre requisições se não limpar!
            try {
                filterChain.doFilter(request, response);
            } finally {
                TenantContext.clear();
                logger.trace("TenantContext limpo após requisição: {}", requestURI);
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
        // Verificar token Firebase
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        String uid = decodedToken.getUid();
        String email = decodedToken.getEmail();
        
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
            logger.info("🔑 Super Admin autenticado: uid={}, email={}, access=GLOBAL", uid, email);
        } else {
            // Cliente normal: buscar tenant_id pelo firebaseUid
            if (tenantRepository != null) {
                Optional<Tenant> tenantOpt = tenantRepository.findByFirebaseUid(uid);
                if (tenantOpt.isPresent()) {
                    Tenant tenant = tenantOpt.get();
                    TenantContext.setCurrentTenantId(tenant.getId());
                    logger.info("👤 Cliente autenticado: uid={}, email={}, tenant_id={}, company={}, access=RESTRICTED", 
                               uid, email, tenant.getId(), tenant.getCompanyName());
                } else {
                    // CASO RARO: Usuário existe no Firebase mas não tem tenant no BD
                    // Pode acontecer durante migração ou se tenant foi deletado
                    logger.warn("⚠️ Usuário sem tenant: uid={}, email={} - Acesso negado para endpoints protegidos", uid, email);
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
        logger.debug("✅ Authentication criado: uid={}, role={}, tenantContext={}", 
                    uid, userRole, TenantContext.getDebugInfo());
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