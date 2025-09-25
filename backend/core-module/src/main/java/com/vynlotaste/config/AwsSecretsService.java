package com.vynlotaste.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import software.amazon.awssdk.services.secretsmanager.model.SecretsManagerException;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class AwsSecretsService {

    private final SecretsManagerClient secretsManagerClient;
    private final ObjectMapper objectMapper;
    private final Map<String, String> secretCache = new ConcurrentHashMap<>();
    
    @Value("${aws.region:us-east-1}")
    private String awsRegion;

    public AwsSecretsService() {
        // Usar região padrão se não estiver configurada
        String region = awsRegion != null && !awsRegion.isEmpty() ? awsRegion : "us-east-1";
        
        this.secretsManagerClient = SecretsManagerClient.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Busca um secret do AWS Secrets Manager
     */
    public String getSecret(String secretName) {
        try {
            // Verificar cache primeiro
            if (secretCache.containsKey(secretName)) {
                log.debug("Secret {} encontrado no cache", secretName);
                return secretCache.get(secretName);
            }

            GetSecretValueRequest request = GetSecretValueRequest.builder()
                    .secretId(secretName)
                    .build();

            GetSecretValueResponse response = secretsManagerClient.getSecretValue(request);
            String secretValue = response.secretString();
            
            // Armazenar no cache
            secretCache.put(secretName, secretValue);
            
            log.info("Secret {} recuperado com sucesso do AWS Secrets Manager", secretName);
            return secretValue;
            
        } catch (SecretsManagerException e) {
            log.error("Erro ao buscar secret {}: {}", secretName, e.getMessage());
            throw new RuntimeException("Falha ao recuperar secret: " + secretName, e);
        }
    }

    /**
     * Busca um secret JSON e retorna um campo específico
     */
    public String getSecretField(String secretName, String fieldName) {
        try {
            String secretJson = getSecret(secretName);
            JsonNode jsonNode = objectMapper.readTree(secretJson);
            String fieldValue = jsonNode.get(fieldName).asText();
            
            log.debug("Campo {} do secret {} recuperado com sucesso", fieldName, secretName);
            return fieldValue;
            
        } catch (Exception e) {
            log.error("Erro ao buscar campo {} do secret {}: {}", fieldName, secretName, e.getMessage());
            throw new RuntimeException("Falha ao recuperar campo do secret", e);
        }
    }

    /**
     * Limpa o cache de secrets (útil para testes ou rotação de secrets)
     */
    public void clearCache() {
        secretCache.clear();
        log.info("Cache de secrets limpo");
    }

    /**
     * Verifica se um secret existe
     */
    public boolean secretExists(String secretName) {
        try {
            getSecret(secretName);
            return true;
        } catch (Exception e) {
            log.debug("Secret {} não existe ou não é acessível: {}", secretName, e.getMessage());
            return false;
        }
    }
}
