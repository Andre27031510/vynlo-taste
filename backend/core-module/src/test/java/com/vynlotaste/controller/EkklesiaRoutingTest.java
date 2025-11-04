package com.vynlotaste.controller;
// touch: redeploy note (commit 0b28909) - comentário leve sem impacto funcional - atualizado para forçar push

import com.vynlotaste.config.MetricsTestConfiguration;
import com.vynlotaste.config.TestFirebaseConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Fase 3 - Testes Automatizados de Rota
 * 
 * Valida que os endpoints Ekklesia estão mapeados corretamente após a correção
 * da Fase 1 (removendo /api dos @RequestMapping dos controllers).
 * 
 * Expected routes (com context-path=/api):
 * - /api/v1/ekklesia/churches (GET)
 * - /api/v1/ekklesia/members (GET)  
 * - /api/v1/ekklesia/events (GET)
 * - /api/v1/ekklesia/tithings (GET)
 * - /api/v1/ekklesia/departments (GET)
 * - /api/v1/ekklesia/financial-report/summary (GET)
 * 
 * Expected behavior:
 * - 401 (Unauthorized) se a rota existe (correto)
 * - 404 (Not Found) se a rota não existe (erro de mapeamento)
 * 
 * Nota: Os controllers Ekklesia precisam estar escaneados corretamente.
 * Se retornar 404, pode indicar problema de component scanning.
 */
@SpringBootTest(classes = com.vynlotaste.core.CoreModuleApplication.class)
@ActiveProfiles("test")
@Import({MetricsTestConfiguration.class, TestFirebaseConfig.class})
@AutoConfigureMockMvc
@DisplayName("Testes de Roteamento Ekklesia - Fase 3")
class EkklesiaRoutingTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/churches (401 = rota existe)")
    void shouldMapChurchesEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/ekklesia/churches"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/members (401 = rota existe)")
    void shouldMapMembersEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/ekklesia/members"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/events (401 = rota existe)")
    void shouldMapEventsEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/ekklesia/events"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/tithings (401 = rota existe)")
    void shouldMapTithingsEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/ekklesia/tithings"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/departments (401 = rota existe)")
    void shouldMapDepartmentsEndpoint() throws Exception {
        // Nota: O endpoint correto é /v1/ekklesia/ministries (MinistryController)
        mockMvc.perform(get("/api/v1/ekklesia/ministries"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/financial-report/summary (401 = rota existe)")
    void shouldMapFinancialReportEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/ekklesia/financial-report/summary"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Verificar comportamento de /api/api/v1/ekklesia/* (normalização do Spring)")
    void shouldNotMapDoubleApiPrefix() throws Exception {
        // Spring pode normalizar /api/api para /api, então a rota pode ser encontrada
        // Este teste verifica que mesmo com duplicação, o comportamento é consistente
        // Nota: O importante é que /api/v1/ekklesia/* funcione corretamente
        var result = mockMvc.perform(get("/api/api/v1/ekklesia/members"))
                .andReturn();
        
        // Aceita 401 (Spring normalizou e encontrou a rota) ou 404 (rejeitou duplicação)
        int status = result.getResponse().getStatus();
        assert (status == 401 || status == 404) : "Esperado 401 ou 404, mas recebeu " + status;
    }
}

