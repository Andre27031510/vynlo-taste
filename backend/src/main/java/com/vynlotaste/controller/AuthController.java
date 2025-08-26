package com.vynlotaste.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.vynlotaste.dto.UserRegistrationDto;
import com.vynlotaste.entity.User;
import com.vynlotaste.exception.BusinessException;
import com.vynlotaste.exception.ResourceNotFoundException;
import com.vynlotaste.exception.UnauthorizedException;
import com.vynlotaste.repository.UserRepository;
import com.vynlotaste.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/firebase")
    public ResponseEntity<?> authenticateFirebase(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("idToken");
            if (idToken == null || idToken.isEmpty()) {
                return ResponseEntity.badRequest().body("ID Token é obrigatório");
            }
            
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("Email não encontrado no token");
            }
            
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (!user.isActive()) {
                    return ResponseEntity.badRequest().body("Usuário inativo");
                }
                log.info("Usuário existente autenticado: {}", user.getEmail());
            } else {
                user = userService.createUserFromFirebase(email, name);
                log.info("Novo usuário Firebase criado: {}", user.getEmail());
            }
            
            return ResponseEntity.ok(Map.of(
                "user", user,
                "message", "Autenticação bem-sucedida"
            ));
            
        } catch (Exception e) {
            log.error("Erro na autenticação Firebase: {}", e.getMessage());
            return ResponseEntity.status(500).body("Erro na autenticação: " + e.getMessage());
        }
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                throw new UnauthorizedException("Token de autorização inválido");
            }

            String idToken = authorization.substring(7);
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            
            if (email == null || email.isEmpty()) {
                throw new UnauthorizedException("Email não encontrado no token");
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                throw new ResourceNotFoundException("Usuário não encontrado");
            }

            User user = userOpt.get();
            if (!user.isActive()) {
                throw new UnauthorizedException("Usuário inativo");
            }

            log.info("Usuário atual recuperado: {}", user.getEmail());
            return ResponseEntity.ok(user);

        } catch (UnauthorizedException | ResourceNotFoundException e) {
            log.warn("Erro ao recuperar usuário atual: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erro inesperado ao recuperar usuário atual: {}", e.getMessage());
            return ResponseEntity.status(500).body("Erro interno do servidor");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            log.info("Tentativa de registro de usuário: email={}", registrationDto.getEmail());

            // Verificar se email já existe
            if (!userService.isEmailAvailable(registrationDto.getEmail())) {
                throw new BusinessException("Email já está em uso");
            }

            // Verificar se username já existe
            if (!userService.isUsernameAvailable(registrationDto.getUsername())) {
                throw new BusinessException("Username já está em uso");
            }

            // Criar usuário
            User newUser = userService.createUserFromRegistration(registrationDto);
            log.info("Usuário registrado com sucesso: id={}, email={}", newUser.getId(), newUser.getEmail());

            return ResponseEntity.ok(Map.of(
                "user", newUser,
                "message", "Usuário registrado com sucesso"
            ));

        } catch (BusinessException e) {
            log.warn("Erro de negócio no registro: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erro inesperado no registro: {}", e.getMessage());
            return ResponseEntity.status(500).body("Erro interno do servidor");
        }
    }
}