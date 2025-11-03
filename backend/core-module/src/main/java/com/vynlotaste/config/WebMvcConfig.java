package com.vynlotaste.config;
// touch: redeploy note (commit 112b089) - comentário leve sem impacto funcional

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração Web MVC - EKKLESIA
 * Fase 4: Registra interceptor de métricas para rastrear 404 em rotas Ekklesia
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final EkklesiaMetricsInterceptor ekklesiaMetricsInterceptor;
    private final ObjectProvider<TenantHibernateFilterInterceptor> tenantHibernateFilterInterceptorProvider;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Fase 4: Registrar interceptor de métricas Ekklesia
        registry.addInterceptor(ekklesiaMetricsInterceptor)
                .addPathPatterns("/api/v1/ekklesia/**");
        // Fase 3: Registrar filtro Hibernate por tenant (aplicado a todas as rotas Ekklesia)
        TenantHibernateFilterInterceptor tenantInterceptor = tenantHibernateFilterInterceptorProvider.getIfAvailable();
        if (tenantInterceptor != null) {
            registry.addInterceptor(tenantInterceptor)
                    .addPathPatterns("/api/v1/ekklesia/**");
        }
    }
}