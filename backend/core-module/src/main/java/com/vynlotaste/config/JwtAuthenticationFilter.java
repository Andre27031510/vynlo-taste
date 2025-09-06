package com.vynlotaste.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.vynlotaste.entity.UserRole;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * Filtro JWT customizado para validação de tokens Firebase
 * Integra autenticação Firebase com Spring Security
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

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
            
            if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                authenticateToken(token, request);
            }
        } catch (Exception e) {
            logger.error("Erro na autenticação JWT: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        
        if (bearerToken != null && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        
        return null;
    }

    private void authenticateToken(String token, HttpServletRequest request) {
        try {
            // Verificar token Firebase
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            
            // Extrair role do token (custom claims)
            UserRole userRole = extractUserRole(decodedToken);
            
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
            
            // Log de auditoria
            logger.info("Usuário autenticado: uid={}, email={}, role={}, ip={}", 
                       uid, email, userRole, getClientIpAddress(request));
            
        } catch (Exception e) {
            logger.error("Falha na verificação do token Firebase: {}", e.getMessage());
            throw new RuntimeException("Token inválido", e);
        }
    }

    private UserRole extractUserRole(FirebaseToken token) {
        // Extrair role dos custom claims do Firebase
        Object roleObj = token.getClaims().get("role");
        
        if (roleObj != null) {
            try {
                return UserRole.valueOf(roleObj.toString().toUpperCase());
            } catch (IllegalArgumentException e) {
                logger.warn("Role inválido no token: {}", roleObj);
            }
        }
        
        // Role padrão se não especificado
        return UserRole.CUSTOMER;
    }

    private boolean isPublicEndpoint(String requestURI) {
        return requestURI.startsWith("/api/v1/auth/") ||
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