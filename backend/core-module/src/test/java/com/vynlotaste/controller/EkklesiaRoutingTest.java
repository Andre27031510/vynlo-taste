package com.vynlotaste.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
 */
@SpringBootTest(classes = com.vynlotaste.core.CoreModuleApplication.class)
@ActiveProfiles("test")
@DisplayName("Testes de Roteamento Ekklesia - Fase 3")
class EkklesiaRoutingTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/churches (401 = rota existe)")
    void shouldMapChurchesEndpoint() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        mockMvc.perform(get("/api/v1/ekklesia/churches"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/members (401 = rota existe)")
    void shouldMapMembersEndpoint() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        mockMvc.perform(get("/api/v1/ekklesia/members"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/events (401 = rota existe)")
    void shouldMapEventsEndpoint() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        mockMvc.perform(get("/api/v1/ekklesia/events"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/tithings (401 = rota existe)")
    void shouldMapTithingsEndpoint() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        mockMvc.perform(get("/api/v1/ekklesia/tithings"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/departments (401 = rota existe)")
    void shouldMapDepartmentsEndpoint() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        mockMvc.perform(get("/api/v1/ekklesia/departments"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Deve mapear /api/v1/ekklesia/financial-report/summary (401 = rota existe)")
    void shouldMapFinancialReportEndpoint() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        mockMvc.perform(get("/api/v1/ekklesia/financial-report/summary"))
                .andExpect(status().isUnauthorized()) // 401 = rota mapeada, falta auth
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("NÃO deve mapear /api/api/v1/ekklesia/* (404 = duplicação erro)")
    void shouldNotMapDoubleApiPrefix() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Se houver duplicação do prefixo /api, esta rota daria 401 ou 200
        // Com a correção, deve dar 404 (não mapeado)
        mockMvc.perform(get("/api/api/v1/ekklesia/members"))
                .andExpect(status().isNotFound()); // 404 = não mapeado (correto)
    }
}

