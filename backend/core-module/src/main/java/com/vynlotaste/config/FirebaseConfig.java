package com.vynlotaste.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Autowired(required = false)
    private AwsSecretsService awsSecretsService;

    @Value("${firebase.project-id:}")
    private String projectId;

    @Value("${firebase.private-key:}")
    private String privateKey;

    @Value("${firebase.client-email:}")
    private String clientEmail;

    @Value("${firebase.aws-secret-name:vynlo-taste-firebase-prod}")
    private String firebaseSecretName;

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(value = "firebase.enabled", havingValue = "true", matchIfMissing = true)
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            
            // Prioridade 1: AWS Secrets Manager (produção)
            try {
                if (awsSecretsService != null && awsSecretsService.secretExists(firebaseSecretName)) {
                    String projectIdFromSecret = awsSecretsService.getSecretField(firebaseSecretName, "project_id");
                    String privateKeyFromSecret = awsSecretsService.getSecretField(firebaseSecretName, "private_key");
                    String clientEmailFromSecret = awsSecretsService.getSecretField(firebaseSecretName, "client_email");
                    
                    String serviceAccountJson = String.format("""
                        {
                            "type": "service_account",
                            "project_id": "%s",
                            "private_key_id": "firebase-key-id",
                            "private_key": "%s",
                            "client_email": "%s",
                            "client_id": "123456789012345678901",
                            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                            "token_uri": "https://oauth2.googleapis.com/token",
                            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%%40%s.iam.gserviceaccount.com",
                            "universe_domain": "googleapis.com"
                        }
                        """, projectIdFromSecret, privateKeyFromSecret, clientEmailFromSecret, projectIdFromSecret);
                    
                    InputStream serviceAccount = new ByteArrayInputStream(serviceAccountJson.getBytes());
                    GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
                    FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .setProjectId(projectIdFromSecret)
                        .build();
                    
                    log.info("Firebase initialized with AWS Secrets Manager");
                    return FirebaseApp.initializeApp(options);
                }
            } catch (Exception e) {
                log.warn("Falha ao carregar Firebase do AWS Secrets Manager: {}", e.getMessage());
            }
            
            // Prioridade 2: Variáveis de ambiente (desenvolvimento)
            if (projectId != null && !projectId.isEmpty() && 
                privateKey != null && !privateKey.isEmpty() && 
                clientEmail != null && !clientEmail.isEmpty()) {
                
                String serviceAccountJson = String.format("""
                    {
                        "type": "service_account",
                        "project_id": "%s",
                        "private_key_id": "firebase-key-id",
                        "private_key": "%s",
                        "client_email": "%s",
                        "client_id": "123456789012345678901",
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%%40%s.iam.gserviceaccount.com",
                        "universe_domain": "googleapis.com"
                    }
                    """, projectId, privateKey, clientEmail, projectId);
                
                InputStream serviceAccount = new ByteArrayInputStream(serviceAccountJson.getBytes());
                GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId(projectId)
                    .build();
                
                log.info("Firebase initialized with environment variables");
                return FirebaseApp.initializeApp(options);
            }
            
            // Prioridade 3: GOOGLE_APPLICATION_CREDENTIALS (desenvolvimento)
            String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            if (credentialsPath != null) {
                GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();
                
                log.info("Firebase initialized with GOOGLE_APPLICATION_CREDENTIALS");
                return FirebaseApp.initializeApp(options);
            }
            
            // REMOVIDO: Arquivo JSON do classpath (RISCO DE SEGURANÇA)
            // Produção DEVE usar AWS Secrets Manager
            log.error("Failed to initialize Firebase: Nenhuma configuração válida encontrada");
            log.error("PRODUÇÃO: Configure AWS Secrets Manager com secret: {}", firebaseSecretName);
            log.error("DESENVOLVIMENTO: Configure variáveis de ambiente ou GOOGLE_APPLICATION_CREDENTIALS");
            throw new RuntimeException("Firebase configuration required - use AWS Secrets Manager in production");
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(value = "firebase.enabled", havingValue = "true", matchIfMissing = true)
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}