package com.vynlotaste.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vynlotaste.entity.User;
import com.vynlotaste.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("UserController - Testes de Integração Robustos")
class UserControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private User testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        testUser = User.builder()
                .firstName("João")
                .lastName("Silva")
                .email("joao@vynlotaste.com")
                .username("joao.silva")
                .phone("+5511999999999")
                .status(User.UserStatus.ACTIVE)
                .role(User.UserRole.CUSTOMER)
                .firebaseUid("firebase123")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Deve sincronizar usuário Firebase com sucesso")
    void shouldSyncFirebaseUserSuccessfully() throws Exception {
        // Given
        String firebaseSyncRequest = """
            {
                "firebaseUid": "firebase123",
                "email": "joao@vynlotaste.com",
                "displayName": "João Silva",
                "emailVerified": true,
                "phoneNumber": "+5511999999999",
                "photoURL": "https://example.com/photo.jpg",
                "creationTime": "2024-12-25T10:30:00Z",
                "lastSignInTime": "2024-12-25T10:30:00Z"
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(firebaseSyncRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Usuário sincronizado com sucesso"))
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.firebaseUid").value("firebase123"))
                .andExpect(jsonPath("$.email").value("joao@vynlotaste.com"));
    }

    @Test
    @DisplayName("Deve retornar erro quando dados obrigatórios estão ausentes")
    void shouldReturnErrorWhenRequiredDataIsMissing() throws Exception {
        // Given
        String invalidRequest = """
            {
                "firebaseUid": "firebase123",
                "email": "",
                "displayName": "João Silva"
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequest))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Deve retornar erro quando email é inválido")
    void shouldReturnErrorWhenEmailIsInvalid() throws Exception {
        // Given
        String invalidEmailRequest = """
            {
                "firebaseUid": "firebase123",
                "email": "email-invalido",
                "displayName": "João Silva",
                "emailVerified": true
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidEmailRequest))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Deve retornar erro quando Firebase UID é nulo")
    void shouldReturnErrorWhenFirebaseUidIsNull() throws Exception {
        // Given
        String nullFirebaseUidRequest = """
            {
                "firebaseUid": null,
                "email": "joao@vynlotaste.com",
                "displayName": "João Silva",
                "emailVerified": true
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(nullFirebaseUidRequest))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Deve retornar erro quando Content-Type é inválido")
    void shouldReturnErrorWhenContentTypeIsInvalid() throws Exception {
        // Given
        String request = """
            {
                "firebaseUid": "firebase123",
                "email": "joao@vynlotaste.com",
                "displayName": "João Silva"
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.TEXT_PLAIN)
                .content(request))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    @DisplayName("Deve retornar erro quando JSON é malformado")
    void shouldReturnErrorWhenJsonIsMalformed() throws Exception {
        // Given
        String malformedJson = """
            {
                "firebaseUid": "firebase123",
                "email": "joao@vynlotaste.com",
                "displayName": "João Silva",
                "emailVerified": true
            """; // Missing closing brace

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(malformedJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Deve lidar com caracteres especiais no nome")
    void shouldHandleSpecialCharactersInName() throws Exception {
        // Given
        String specialCharsRequest = """
            {
                "firebaseUid": "firebase456",
                "email": "maria@vynlotaste.com",
                "displayName": "Maria José da Silva-Santos",
                "emailVerified": true,
                "phoneNumber": "+5511888888888"
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(specialCharsRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("Deve lidar com números de telefone internacionais")
    void shouldHandleInternationalPhoneNumbers() throws Exception {
        // Given
        String internationalPhoneRequest = """
            {
                "firebaseUid": "firebase789",
                "email": "international@vynlotaste.com",
                "displayName": "International User",
                "emailVerified": true,
                "phoneNumber": "+1234567890"
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(internationalPhoneRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("Deve validar tamanho máximo dos campos")
    void shouldValidateMaximumFieldLengths() throws Exception {
        // Given
        String longString = "a".repeat(1000);
        String longFieldRequest = String.format("""
            {
                "firebaseUid": "firebase999",
                "email": "test@vynlotaste.com",
                "displayName": "%s",
                "emailVerified": true
            }
            """, longString);

        // When & Then
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(longFieldRequest))
                .andExpect(status().isBadRequest());
    }
}
