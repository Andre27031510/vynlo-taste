package com.vynlotaste.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Slf4j
@Service
public class FirebaseService {
    
    @Value("${firebase.config.path:firebase-service-account.json}")
    private String firebaseConfigPath;
    
    @Value("${firebase.project-id:}")
    private String projectId;
    
    private FirebaseAuth firebaseAuth;
    
    @PostConstruct
    public void initializeFirebase() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath);
                
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setProjectId(projectId)
                    .build();
                
                FirebaseApp.initializeApp(options);
                log.info("Firebase inicializado com sucesso");
            }
            
            firebaseAuth = FirebaseAuth.getInstance();
        } catch (IOException e) {
            log.error("Erro ao inicializar Firebase: {}", e.getMessage());
        }
    }
    
    public boolean isHealthy() {
        try {
            return firebaseAuth != null && FirebaseApp.getInstance() != null;
        } catch (Exception e) {
            log.warn("Firebase health check falhou: {}", e.getMessage());
            return false;
        }
    }
    
    public String getStatus() {
        return isHealthy() ? "UP" : "DOWN";
    }
    
    public UserRecord getUserByEmail(String email) throws FirebaseAuthException {
        return firebaseAuth.getUserByEmail(email);
    }
    
    public UserRecord createUser(String email, String password) throws FirebaseAuthException {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
            .setEmail(email)
            .setPassword(password)
            .setEmailVerified(false);
            
        return firebaseAuth.createUser(request);
    }
}