package com.vynlotaste.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            
            // Tentar GOOGLE_APPLICATION_CREDENTIALS primeiro (produção)
            String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            if (credentialsPath != null) {
                GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();
                
                log.info("Firebase initialized with GOOGLE_APPLICATION_CREDENTIALS");
                return FirebaseApp.initializeApp(options);
            }
            
            // Fallback: usar arquivo JSON do classpath
            try {
                InputStream serviceAccount = new ClassPathResource("firebase-service-account.json").getInputStream();
                
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
                
                log.info("Firebase initialized with classpath JSON file");
                return FirebaseApp.initializeApp(options);
                
            } catch (Exception e) {
                log.error("Failed to initialize Firebase: {}", e.getMessage());
                throw new RuntimeException("Firebase configuration required", e);
            }
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}