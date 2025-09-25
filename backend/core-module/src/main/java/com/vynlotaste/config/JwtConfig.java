package com.vynlotaste.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class JwtConfig {

    @Autowired(required = false)
    private AwsSecretsService awsSecretsService;

    @Value("${security.jwt.secret:}")
    private String jwtSecret;

    @Value("${security.jwt.expiration:86400000}")
    private Long jwtExpiration;

    @Value("${security.jwt.aws-secret-name:vynlo-taste-jwt-prod}")
    private String jwtSecretName;

    @Bean
    public String jwtSecret() {
        try {
            // Prioridade 1: AWS Secrets Manager (produção)
            if (awsSecretsService != null && awsSecretsService.secretExists(jwtSecretName)) {
                String secretFromAws = awsSecretsService.getSecretField(jwtSecretName, "secret");
                log.info("JWT secret carregado do AWS Secrets Manager");
                return secretFromAws;
            }
        } catch (Exception e) {
            log.warn("Falha ao carregar JWT secret do AWS Secrets Manager: {}", e.getMessage());
        }

        // Prioridade 2: Variável de ambiente (desenvolvimento)
        if (jwtSecret != null && !jwtSecret.isEmpty()) {
            log.info("JWT secret carregado de variável de ambiente");
            return jwtSecret;
        }

        // Fallback: secret padrão (apenas para desenvolvimento)
        log.warn("Usando JWT secret padrão - NÃO RECOMENDADO PARA PRODUÇÃO");
        return "your-super-secret-jwt-key-change-in-production";
    }

    @Bean
    public Long jwtExpiration() {
        try {
            // Prioridade 1: AWS Secrets Manager (produção)
            if (awsSecretsService != null && awsSecretsService.secretExists(jwtSecretName)) {
                String expirationFromAws = awsSecretsService.getSecretField(jwtSecretName, "expiration");
                Long expiration = Long.parseLong(expirationFromAws);
                log.info("JWT expiration carregado do AWS Secrets Manager: {} ms", expiration);
                return expiration;
            }
        } catch (Exception e) {
            log.warn("Falha ao carregar JWT expiration do AWS Secrets Manager: {}", e.getMessage());
        }

        // Prioridade 2: Configuração padrão
        log.info("JWT expiration carregado da configuração: {} ms", jwtExpiration);
        return jwtExpiration;
    }
}
