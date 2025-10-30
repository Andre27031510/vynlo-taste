package com.vynlotaste.config;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.observability.TenantSecurityMetrics;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class EkklesiaExceptionHandler {

    private final TenantSecurityMetrics metrics;

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        String message = ex.getMessage() != null ? ex.getMessage() : "Bad request";

        // Detectar mismatch de tenant pelas mensagens padronizadas dos Services
        if (message.contains("não pertence ao tenant atual")) {
            String requestId = request.getHeader("X-Request-ID");
            String uri = request.getRequestURI();
            String method = request.getMethod();
            Long tenantId = TenantContext.getCurrentTenantId();

            metrics.incrementMismatch("tenant_mismatch", uri, method);
            log.warn("SECURITY_TENANT_MISMATCH requestId={} uri={} method={} tenantId={} msg={}",
                    requestId, uri, method, tenantId, message);

            return buildError(HttpStatus.FORBIDDEN, "Tenant mismatch", message, requestId);
        }

        // Padrão
        return buildError(HttpStatus.BAD_REQUEST, "Bad request", message, request.getHeader("X-Request-ID"));
    }

    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String error, String message, String requestId) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        if (requestId != null && !requestId.isEmpty()) {
            body.put("requestId", requestId);
        }
        return ResponseEntity.status(status).body(body);
    }
}


