package com.vynlotaste.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.vynlotaste.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseUserSyncService {

    private final UserService userService;
    private final FirebaseAuth firebaseAuth;

    @Async
    @Transactional
    public CompletableFuture<Void> syncFirebaseUserAsync(String firebaseUid) {
        try {
            log.info("🔄 Iniciando sincronização assíncrona para UID: {}", firebaseUid);
            
            // Buscar dados do Firebase
            UserRecord firebaseUser = firebaseAuth.getUser(firebaseUid);
            
            // Verificar se já existe no banco
            Optional<User> existingUser = userService.findByEmail(firebaseUser.getEmail());
            
            if (existingUser.isEmpty()) {
                // Criar novo usuário
                User newUser = userService.createUserFromFirebase(
                    firebaseUser.getEmail(), 
                    firebaseUser.getDisplayName()
                );
                newUser.setFirebaseUid(firebaseUid);
                newUser.setEmailVerified(firebaseUser.isEmailVerified());
                
                if (firebaseUser.getPhoneNumber() != null) {
                    newUser.setPhone(firebaseUser.getPhoneNumber());
                }
                
                if (firebaseUser.getPhotoUrl() != null) {
                    newUser.setProfileImage(firebaseUser.getPhotoUrl());
                }
                
                userService.save(newUser);
                
                log.info("✅ Usuário Firebase sincronizado: ID={}, Email={}, UID={}", 
                        newUser.getId(), newUser.getEmail(), firebaseUid);
            } else {
                // Atualizar usuário existente
                User user = existingUser.get();
                boolean updated = false;
                
                if (user.getFirebaseUid() == null || !user.getFirebaseUid().equals(firebaseUid)) {
                    user.setFirebaseUid(firebaseUid);
                    updated = true;
                }
                
                if (user.isEmailVerified() != firebaseUser.isEmailVerified()) {
                    user.setEmailVerified(firebaseUser.isEmailVerified());
                    updated = true;
                }
                
                if (updated) {
                    userService.save(user);
                    log.info("🔄 Usuário existente atualizado: {}", firebaseUser.getEmail());
                }
            }
            
        } catch (Exception e) {
            log.error("❌ Erro na sincronização assíncrona para UID {}: {}", firebaseUid, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    @Transactional
    public void syncFirebaseUserSync(String email, String firebaseUid, String displayName, boolean emailVerified) {
        try {
            log.info("🔄 Sincronização síncrona: {} ({})", email, firebaseUid);
            
            Optional<User> existingUser = userService.findByEmail(email);
            
            if (existingUser.isEmpty()) {
                User newUser = userService.createUserFromFirebase(email, displayName);
                newUser.setFirebaseUid(firebaseUid);
                newUser.setEmailVerified(emailVerified);
                userService.save(newUser);
                
                log.info("✅ Usuário criado via webhook: ID={}, Email={}", newUser.getId(), email);
            } else {
                User user = existingUser.get();
                if (user.getFirebaseUid() == null || !user.getFirebaseUid().equals(firebaseUid)) {
                    user.setFirebaseUid(firebaseUid);
                    user.setEmailVerified(emailVerified);
                    userService.save(user);
                    log.info("🔄 UID atualizado via webhook: {}", email);
                }
            }
            
        } catch (Exception e) {
            log.error("❌ Erro na sincronização webhook: {}", e.getMessage(), e);
            throw e;
        }
    }
}