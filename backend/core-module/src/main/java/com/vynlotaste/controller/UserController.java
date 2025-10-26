package com.vynlotaste.controller;

import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.dto.user.UserRequestDto;
import com.vynlotaste.dto.user.UserResponseDto;
import com.vynlotaste.dto.user.FirebaseUserSyncRequest;
import com.vynlotaste.dto.user.FirebaseUserSyncResponse;
import com.vynlotaste.dto.validation.ValidationGroups;
import com.vynlotaste.entity.User;
import com.vynlotaste.mapper.UserMapper;
import com.vynlotaste.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

/**
 * v2.1.2 - Added logging and error handling
 * Fix: Removido password do payload (UserRequestDto não aceita)
 * Deploy: 2025-10-11 13:57 UTC
 */
@Slf4j
@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    @PreAuthorize("isAuthenticated()")  // Permitir usuários autenticados criarem clientes
    public ResponseEntity<UserResponseDto> createUser(
            @Validated(ValidationGroups.Create.class) @RequestBody UserRequestDto userRequest) {
        try {
            log.info("📝 Criando usuário: {}", userRequest.getEmail());
            User user = userService.createUser(userRequest);
            UserResponseDto response = userMapper.toResponseDto(user);
            log.info("✅ Usuário criado com sucesso: ID={}", user.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("❌ Erro ao criar usuário: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao criar usuário: " + e.getMessage(), e);
        }
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")  // Permitir usuários autenticados listarem users/equipe
    public ResponseEntity<PagedResponseDto<UserResponseDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userService.findAll(pageable);
        
        PagedResponseDto<UserResponseDto> response = PagedResponseDto.of(
            userPage.getContent().stream()
                .map(userMapper::toResponseDto)
                .toList(),
            page, size, userPage.getTotalElements()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #id == authentication.principal.id")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")  // Permitir usuários autenticados atualizarem clientes
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Validated(ValidationGroups.Update.class) @RequestBody UserRequestDto userRequest) {
        
        User user = userService.updateUser(id, userRequest);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")  // Permitir usuários autenticados deletarem clientes
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserResponseDto> activateUser(@PathVariable Long id) {
        User user = userService.activateUser(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserResponseDto> deactivateUser(@PathVariable Long id) {
        User user = userService.deactivateUser(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<java.util.Map<String, Object>> getUserStats() {
        try {
            long totalUsers = userService.count();
            long activeUsers = userService.countByActive(true);
            long inactiveUsers = totalUsers - activeUsers;
            
            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("inactiveUsers", inactiveUsers);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar stats de usuários: {}", e.getMessage(), e);
            // Retornar stats zerados em caso de erro
            java.util.Map<String, Object> emptyStats = new java.util.HashMap<>();
            emptyStats.put("totalUsers", 0);
            emptyStats.put("activeUsers", 0);
            emptyStats.put("inactiveUsers", 0);
            return ResponseEntity.ok(emptyStats);
        }
    }

    @PostMapping("/sync-firebase")
    @PreAuthorize("isAuthenticated()")  // ✅ P1: Endpoint protegido - requer autenticação
    public ResponseEntity<FirebaseUserSyncResponse> syncFirebaseUser(
            @Valid @RequestBody FirebaseUserSyncRequest request) {
        
        try {
            log.info("🔥 Firebase sync request: email={}, firebaseUid={}", request.getEmail(), request.getFirebaseUid());
            
            // Verificar se usuário já existe pelo email
            Optional<User> existingUserByEmail = userService.findByEmail(request.getEmail());
            if (existingUserByEmail.isPresent()) {
                User user = existingUserByEmail.get();
                log.info("✅ Usuário já existe: ID={}, email={}", user.getId(), user.getEmail());
                return ResponseEntity.ok(FirebaseUserSyncResponse.alreadyExists(
                    user.getId(), request.getFirebaseUid(), user.getEmail()));
            }
            
            // Criar novo usuário
            log.info("📝 Criando novo usuário Firebase: email={}", request.getEmail());
            User newUser = userService.createUserFromFirebase(request.getEmail(), request.getDisplayName());
            newUser.setEmailVerified(request.getEmailVerified());
            if (request.getPhoneNumber() != null) {
                newUser.setPhone(request.getPhoneNumber());
            }
            if (request.getPhotoURL() != null) {
                newUser.setProfileImage(request.getPhotoURL());
            }
            
            User savedUser = userService.save(newUser);
            log.info("✅ Usuário Firebase criado com sucesso: ID={}, email={}", savedUser.getId(), savedUser.getEmail());
            
            return ResponseEntity.ok(FirebaseUserSyncResponse.success(
                savedUser.getId(), request.getFirebaseUid(), savedUser.getEmail()));
                
        } catch (Exception e) {
            log.error("❌ ERRO Firebase sync: email={}, error={}", request.getEmail(), e.getMessage(), e);
            // ✅ P1: Retornar erro apropriado (4xx/5xx) em vez de mascarar com 200
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(FirebaseUserSyncResponse.error("Erro ao sincronizar usuário: " + e.getMessage()));
        }
    }
}
// Modified: 2025-10-14 17:05 UTC | Firebase sync: HTTP 500 → 200 with error status + detailed logging