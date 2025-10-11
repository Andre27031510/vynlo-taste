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

    @PostMapping("/sync-firebase")
    public ResponseEntity<FirebaseUserSyncResponse> syncFirebaseUser(
            @Valid @RequestBody FirebaseUserSyncRequest request) {
        
        try {
            // Verificar se usuário já existe pelo email
            Optional<User> existingUserByEmail = userService.findByEmail(request.getEmail());
            if (existingUserByEmail.isPresent()) {
                User user = existingUserByEmail.get();
                return ResponseEntity.ok(FirebaseUserSyncResponse.alreadyExists(
                    user.getId(), request.getFirebaseUid(), user.getEmail()));
            }
            
            // Criar novo usuário
            User newUser = userService.createUserFromFirebase(request.getEmail(), request.getDisplayName());
            newUser.setEmailVerified(request.getEmailVerified());
            if (request.getPhoneNumber() != null) {
                newUser.setPhone(request.getPhoneNumber());
            }
            if (request.getPhotoURL() != null) {
                newUser.setProfileImage(request.getPhotoURL());
            }
            
            User savedUser = userService.save(newUser);
            
            return ResponseEntity.ok(FirebaseUserSyncResponse.success(
                savedUser.getId(), request.getFirebaseUid(), savedUser.getEmail()));
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(FirebaseUserSyncResponse.error("Erro ao sincronizar usuário: " + e.getMessage()));
        }
    }
}