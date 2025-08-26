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

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
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
        
        try {
            String token = extractTokenFromRequest(request);
            
            if (StringUtils.hasText(token)) {
                FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
                String email = decodedToken.getEmail();
                
                if (StringUtils.hasText(email)) {
                    Optional<User> userOpt = userRepository.findByEmail(email);
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        if (user.isActive()) {
                            UserDetails userDetails = createUserDetails(user);
                            UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                            
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            log.debug("Usuário autenticado: {}", email);
                        } else {
                            log.warn("Usuário inativo tentou acessar: {}", email);
                        }
                    } else {
                        log.warn("Usuário não encontrado no banco: {}", email);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Erro na autenticação Firebase: {}", e.getMessage());
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
