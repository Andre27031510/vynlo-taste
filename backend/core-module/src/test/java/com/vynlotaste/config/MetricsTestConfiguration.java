package com.vynlotaste.config;

import com.vynlotaste.observability.TenantSecurityMetrics;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

/**
 * PADRÃO BIG TECH: Configuração de Teste Centralizada
 * 
 * Fornece mocks de beans opcionais que não estão disponíveis no profile de teste.
 * 
 * Uso:
 * - Importe esta classe nos testes com @Import(MetricsTestConfiguration.class)
 * 
 * Benefícios:
 * - Testes determinísticos (sem dependências de infraestrutura real)
 * - Isolamento de dependências opcionais (MeterRegistry, Prometheus, etc)
 * - Facilita testes unitários e de integração
 * 
 * @author Sistema Vynlo Taste
 * @since 2025-11-03
 */
@TestConfiguration
public class MetricsTestConfiguration {

    /**
     * Mock do TenantSecurityMetrics para testes.
     * 
     * PADRÃO BIG TECH: Bean opcional que só existe se MeterRegistry estiver disponível.
     * Em testes, fornecemos um mock para evitar NoSuchBeanDefinitionException.
     * 
     * @return Mock do TenantSecurityMetrics
     */
    @Bean
    @Primary
    public TenantSecurityMetrics tenantSecurityMetrics() {
        return Mockito.mock(TenantSecurityMetrics.class);
    }
}

