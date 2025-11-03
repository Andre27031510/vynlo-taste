package com.vynlotaste.config;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

/**
 * PADRÃO BIG TECH: Configuração de Teste para Firebase
 * 
 * Fornece mocks do FirebaseApp e FirebaseAuth para evitar tentativas de carregar
 * chaves reais em ambiente de teste (que causam "Invalid PKCS#8 data").
 * 
 * Uso:
 * - Importe esta classe nos testes com @Import(TestFirebaseConfig.class)
 * - Aplique junto com @Import(MetricsTestConfiguration.class) para configuração completa
 * 
 * Benefícios:
 * - Testes determinísticos (sem dependências de infraestrutura real)
 * - Evita falhas de contexto por chaves Firebase inválidas
 * - Isolamento completo de dependências externas
 * 
 * @author Sistema Vynlo Taste
 * @since 2025-11-03
 */
@TestConfiguration
public class TestFirebaseConfig {

    /**
     * Mock do FirebaseApp para testes.
     * 
     * PADRÃO BIG TECH: Evita tentativas de inicializar FirebaseApp com chaves reais
     * que causam "Invalid PKCS#8 data" em ambiente de teste.
     * 
     * @return Mock do FirebaseApp
     */
    @Bean
    @Primary
    public FirebaseApp firebaseApp() {
        return Mockito.mock(FirebaseApp.class);
    }

    /**
     * Mock do FirebaseAuth para testes.
     * 
     * PADRÃO BIG TECH: Evita dependências de FirebaseApp real que podem falhar
     * se o FirebaseApp não estiver corretamente inicializado.
     * 
     * @return Mock do FirebaseAuth
     */
    @Bean
    @Primary
    public FirebaseAuth firebaseAuth() {
        return Mockito.mock(FirebaseAuth.class);
    }
}

