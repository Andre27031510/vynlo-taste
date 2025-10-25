package com.vynlotaste.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.vynlotaste.config.AwsSecretsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Service
public class FirebaseService {
    
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
    
    private FirebaseAuth firebaseAuth;
    
    @PostConstruct
    public void initializeFirebase() {
        try {
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
                        
                        FirebaseApp.initializeApp(options);
                        log.info("✅ Firebase Service inicializado com AWS Secrets Manager");
                    }
                } catch (Exception e) {
                    log.warn("⚠️ Falha ao carregar Firebase do AWS Secrets Manager: {}", e.getMessage());
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
                    
                    FirebaseApp.initializeApp(options);
                    log.info("✅ Firebase Service inicializado com variáveis de ambiente");
                }
                
                // Prioridade 3: GOOGLE_APPLICATION_CREDENTIALS (desenvolvimento)
                String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
                if (credentialsPath != null) {
                    GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
                    FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .build();
                    
                    FirebaseApp.initializeApp(options);
                    log.info("✅ Firebase Service inicializado com GOOGLE_APPLICATION_CREDENTIALS");
                }
                
                // Se nenhuma configuração funcionou
                if (FirebaseApp.getApps().isEmpty()) {
                    log.error("❌ Failed to initialize Firebase Service: Nenhuma configuração válida encontrada");
                    log.error("PRODUÇÃO: Configure AWS Secrets Manager com secret: {}", firebaseSecretName);
                    log.error("DESENVOLVIMENTO: Configure variáveis de ambiente ou GOOGLE_APPLICATION_CREDENTIALS");
                    return; // Não falhar o startup
                }
            }
            
            firebaseAuth = FirebaseAuth.getInstance();
            log.info("✅ Firebase Service pronto para validação de tokens");
            
        } catch (Exception e) {
            log.error("❌ Erro ao inicializar Firebase Service: {}", e.getMessage(), e);
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