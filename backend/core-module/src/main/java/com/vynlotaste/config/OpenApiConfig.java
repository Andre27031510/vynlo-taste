package com.vynlotaste.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.servlet.context-path:/api}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Vynlo Taste API")
                .description("Sistema Empresarial de Delivery - API REST completa para gestão de pedidos, produtos e usuários")
                .version("v1.0.0")
                .contact(new Contact()
                    .name("Equipe Vynlo Taste")
                    .email("api@vynlotaste.com")
                    .url("https://vynlotaste.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .servers(List.of(
                new Server().url("http://localhost:8080" + contextPath).description("Desenvolvimento"),
                new Server().url("https://staging-api.vynlotaste.com" + contextPath).description("Homologação"),
                new Server().url("https://api.vynlotaste.com" + contextPath).description("Produção")))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Token JWT obtido através do endpoint de autenticação"))
                .addSecuritySchemes("firebaseAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("Firebase ID Token")
                    .description("Token Firebase ID obtido através do Firebase Auth")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .addSecurityItem(new SecurityRequirement().addList("firebaseAuth"));
    }
}