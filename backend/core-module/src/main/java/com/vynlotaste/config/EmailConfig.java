package com.vynlotaste.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class EmailConfig {

    private final AwsSecretsService awsSecretsService;

    @Bean
    @Primary
    @ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod")
    public JavaMailSender javaMailSenderProd() {
        try {
            // Buscar configurações do AWS Secrets Manager
            String host = awsSecretsService.getSecretField("vynlo-taste-email-config", "host");
            String port = awsSecretsService.getSecretField("vynlo-taste-email-config", "port");
            String username = awsSecretsService.getSecretField("vynlo-taste-email-config", "username");
            String password = awsSecretsService.getSecretField("vynlo-taste-email-config", "password");

            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(host);
            mailSender.setPort(Integer.parseInt(port));
            mailSender.setUsername(username);
            mailSender.setPassword(password);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.starttls.required", "true");
            props.put("mail.smtp.connectiontimeout", "5000");
            props.put("mail.smtp.timeout", "3000");
            props.put("mail.smtp.writetimeout", "5000");

            log.info("JavaMailSender configurado com AWS Secrets Manager - Host: {}, Port: {}", host, port);
            return mailSender;

        } catch (Exception e) {
            log.error("Erro ao configurar JavaMailSender com AWS Secrets Manager: {}", e.getMessage());
            log.error("PRODUÇÃO: Email service não disponível - verifique secret 'vynlo-taste-email-config' no AWS Secrets Manager");
            // REMOVIDO: Fallback inseguro com senha hardcoded
            // Produção DEVE usar AWS Secrets Manager
            throw new RuntimeException("Email configuration required - use AWS Secrets Manager in production", e);
        }
    }
}