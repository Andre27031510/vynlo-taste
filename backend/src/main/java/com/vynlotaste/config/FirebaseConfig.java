package com.vynlotaste.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account.path:firebase-service-account.json}")
    private String serviceAccountPath;

    @Value("${firebase.project-id:vynlo-sistema}")
    private String projectId;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        try {
            // Verifica se já existe uma instância do Firebase
            if (!FirebaseApp.getApps().isEmpty()) {
                log.info("Firebase já está inicializado, retornando instância existente");
                return FirebaseApp.getInstance();
            }

            // Carrega as credenciais do arquivo de configuração
            Resource resource = new ClassPathResource(serviceAccountPath);
            if (!resource.exists()) {
                throw new IOException("Arquivo de configuração Firebase não encontrado: " + serviceAccountPath);
            }

            try (InputStream serviceAccount = resource.getInputStream()) {
                GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
                
                FirebaseOptions options = FirebaseOptions.builder()
                    .setProjectId(projectId)
                    .setCredentials(credentials)
                    .setStorageBucket("vynlo-sistema.firebasestorage.app")
                    .build();

                FirebaseApp app = FirebaseApp.initializeApp(options);
                log.info("Firebase inicializado com sucesso para o projeto: {}", projectId);
                return app;
            }
        } catch (Exception e) {
            log.error("Erro ao inicializar Firebase: {}", e.getMessage(), e);
            throw new RuntimeException("Falha na inicialização do Firebase", e);
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        try {
            FirebaseAuth auth = FirebaseAuth.getInstance(firebaseApp);
            log.info("Firebase Auth configurado com sucesso");
            return auth;
        } catch (Exception e) {
            log.error("Erro ao configurar Firebase Auth: {}", e.getMessage(), e);
            throw new RuntimeException("Falha na configuração do Firebase Auth", e);
        }
    }
}
