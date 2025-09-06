package com.vynlotaste.financial.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Configuração do módulo financeiro
 * Ativado apenas quando a propriedade financial.module.enabled=true
 */
@Configuration
@ConditionalOnProperty(name = "financial.module.enabled", havingValue = "true", matchIfMissing = false)
@ComponentScan(basePackages = "com.vynlotaste.financial")
@EnableJpaRepositories(basePackages = "com.vynlotaste.financial.repository")
public class FinancialModuleConfig {
    
    // Configurações específicas do módulo financeiro serão adicionadas aqui
}