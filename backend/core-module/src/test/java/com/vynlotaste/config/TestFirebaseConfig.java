package com.vynlotaste.config;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.util.Date;

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
 * - Mock retorna getOptions() válido para evitar NullPointerException
 * 
 * @author Sistema Vynlo Taste
 * @since 2025-11-03
 */
@TestConfiguration
public class TestFirebaseConfig {

    /**
     * Mock do FirebaseApp para testes com getOptions() válido.
     * 
     * PADRÃO BIG TECH: Evita tentativas de inicializar FirebaseApp com chaves reais
     * que causam "Invalid PKCS#8 data" em ambiente de teste.
     * Mock configurado com FirebaseOptions válido para evitar NullPointerException
     * quando código chama FirebaseApp.getOptions().
     * 
     * @return Mock do FirebaseApp com options válido
     */
    @Bean
    @Primary
    public FirebaseApp firebaseApp() {
        // Criar FirebaseOptions válido para o mock
        AccessToken token = new AccessToken("test-token", new Date(System.currentTimeMillis() + 3_600_000));
        GoogleCredentials credentials = GoogleCredentials.create(token);
        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        HttpTransport transport = new NetHttpTransport();
        
        FirebaseOptions options = FirebaseOptions.builder()
            .setProjectId("test-project")
            .setCredentials(credentials)
            .setJsonFactory(jsonFactory)
            .setHttpTransport(transport)
            .build();

        // Criar mock e configurar comportamentos
        FirebaseApp mockApp = Mockito.mock(FirebaseApp.class);
        Mockito.when(mockApp.getName()).thenReturn("mockFirebaseApp");
        Mockito.when(mockApp.getOptions()).thenReturn(options);
        
        return mockApp;
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

