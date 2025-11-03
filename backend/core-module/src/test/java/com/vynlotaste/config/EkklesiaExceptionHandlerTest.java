package com.vynlotaste.config;

import com.vynlotaste.observability.TenantSecurityMetrics;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * PADRÃO BIG TECH: Teste Unitário para EkklesiaExceptionHandler
 * 
 * Valida comportamento do exception handler com e sem TenantSecurityMetrics disponível.
 * 
 * @author Sistema Vynlo Taste
 * @since 2025-11-03
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes Unitários - EkklesiaExceptionHandler")
class EkklesiaExceptionHandlerTest {

    @Mock
    private TenantSecurityMetrics metrics;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private EkklesiaExceptionHandler exceptionHandler;

    @BeforeEach
    void setup() {
        when(request.getHeader("X-Request-ID")).thenReturn("test-request-id");
        when(request.getRequestURI()).thenReturn("/api/v1/ekklesia/tithings");
        when(request.getMethod()).thenReturn("POST");
    }

    @Test
    @DisplayName("Deve processar IllegalArgumentException genérico (sem tenant mismatch)")
    void shouldHandleGenericIllegalArgumentException() {
        // Given
        IllegalArgumentException ex = new IllegalArgumentException("Invalid input");

        // When
        ResponseEntity<?> response = exceptionHandler.handleIllegalArgument(ex, request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(400, body.get("status"));
        assertEquals("Bad request", body.get("error"));
        assertEquals("Invalid input", body.get("message"));
        assertEquals("test-request-id", body.get("requestId"));

        // Métricas não devem ser incrementadas para erros genéricos
        verify(metrics, never()).incrementMismatch(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Deve processar tenant mismatch e incrementar métricas")
    void shouldHandleTenantMismatchAndIncrementMetrics() {
        // Given
        IllegalArgumentException ex = new IllegalArgumentException("Member não pertence ao tenant atual");

        // When
        ResponseEntity<?> response = exceptionHandler.handleIllegalArgument(ex, request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(403, body.get("status"));
        assertEquals("Tenant mismatch", body.get("error"));
        assertEquals("Member não pertence ao tenant atual", body.get("message"));
        assertEquals("test-request-id", body.get("requestId"));

        // Métricas devem ser incrementadas para tenant mismatch
        verify(metrics, times(1)).incrementMismatch("tenant_mismatch", "/api/v1/ekklesia/tithings", "POST");
    }

    @Test
    @DisplayName("Deve funcionar mesmo sem TenantSecurityMetrics (modo degradado)")
    void shouldWorkWithoutMetrics() {
        // Given
        EkklesiaExceptionHandler handlerWithoutMetrics = new EkklesiaExceptionHandler(null);
        IllegalArgumentException ex = new IllegalArgumentException("Member não pertence ao tenant atual");

        // When
        ResponseEntity<?> response = handlerWithoutMetrics.handleIllegalArgument(ex, request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(403, body.get("status"));
        assertEquals("Tenant mismatch", body.get("error"));
        
        // Não deve lançar NullPointerException mesmo sem métricas
        assertDoesNotThrow(() -> handlerWithoutMetrics.handleIllegalArgument(ex, request));
    }

    @Test
    @DisplayName("Deve tratar IllegalArgumentException com mensagem null")
    void shouldHandleNullMessage() {
        // Given
        IllegalArgumentException ex = new IllegalArgumentException((String) null);

        // When
        ResponseEntity<?> response = exceptionHandler.handleIllegalArgument(ex, request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("Bad request", body.get("message"));
    }

    @Test
    @DisplayName("Deve incluir requestId quando disponível")
    void shouldIncludeRequestIdWhenAvailable() {
        // Given
        when(request.getHeader("X-Request-ID")).thenReturn("custom-request-id-123");
        IllegalArgumentException ex = new IllegalArgumentException("Test error");

        // When
        ResponseEntity<?> response = exceptionHandler.handleIllegalArgument(ex, request);

        // Then
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("custom-request-id-123", body.get("requestId"));
    }

    @Test
    @DisplayName("Deve funcionar sem requestId no header")
    void shouldWorkWithoutRequestId() {
        // Given
        when(request.getHeader("X-Request-ID")).thenReturn(null);
        IllegalArgumentException ex = new IllegalArgumentException("Test error");

        // When
        ResponseEntity<?> response = exceptionHandler.handleIllegalArgument(ex, request);

        // Then
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertNull(body.get("requestId"));
    }
}

