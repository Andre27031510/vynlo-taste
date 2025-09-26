package com.vynlotaste.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.vynlotaste.entity.User;
import com.vynlotaste.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@ConditionalOnProperty(name = "firebase.auth.enabled", havingValue = "true", matchIfMissing = false)
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;

    public FirebaseAuthenticationFilter(FirebaseAuth firebaseAuth, UserRepository userRepository) {
        this.firebaseAuth = firebaseAuth;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        // Aplicar apenas ao endpoint de sincronização Firebase
        if (!request.getRequestURI().equals("/api/v1/users/sync-firebase") || 
            !request.getMethod().equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String token = extractTokenFromRequest(request);
            
            if (!StringUtils.hasText(token)) {
                log.warn("Token Firebase não fornecido para endpoint de sincronização");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token de autenticação Firebase obrigatório\"}");
                return;
            }
            
            try {
                FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
                String email = decodedToken.getEmail();
                String uid = decodedToken.getUid();
                
                if (StringUtils.hasText(email) && StringUtils.hasText(uid)) {
                    // Para sincronização, criar autenticação temporária com dados do Firebase
                    UserDetails tempUserDetails = org.springframework.security.core.userdetails.User.builder()
                            .username(email)
                            .password("")
                            .authorities("ROLE_USER") // Role padrão para novos usuários
                            .build();
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(tempUserDetails, null, tempUserDetails.getAuthorities());
                    
                    // Adicionar informações do Firebase ao contexto
                    authentication.setDetails(Map.of(
                        "firebaseUid", uid,
                        "email", email,
                        "emailVerified", decodedToken.isEmailVerified()
                    ));
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Token Firebase válido para sincronização: {} (UID: {})", email, uid);
                } else {
                    log.warn("Email ou UID não encontrado no token Firebase");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Token Firebase inválido - dados incompletos\"}");
                    return;
                }
            } catch (Exception firebaseException) {
                log.warn("Firebase token validation failed: {}", firebaseException.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token Firebase inválido ou expirado\"}");
                return;
            }
        } catch (Exception e) {
            log.warn("Erro na autenticação Firebase: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Erro interno de autenticação\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private UserDetails createUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password("") // Firebase não usa senha
                .authorities("ROLE_" + user.getRole().name())
                .accountExpired(!user.isActive())
                .accountLocked(!user.isActive())
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }
}
