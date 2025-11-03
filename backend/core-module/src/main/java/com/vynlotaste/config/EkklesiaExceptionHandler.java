package com.vynlotaste.config;
// touch: redeploy note (commit 63d07f0) - comentário leve sem impacto funcional - atualizado para forçar push

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.observability.TenantSecurityMetrics;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class EkklesiaExceptionHandler {

    // PADRÃO BIG TECH: Bean opcional - permite modo degradado se TenantSecurityMetrics não estiver disponível
    // @Autowired(required=false) permite que a aplicação inicie mesmo sem métricas configuradas
    private final TenantSecurityMetrics metrics;

    // Construtor com injeção opcional (fallback para graceful degradation)
    public EkklesiaExceptionHandler(@Autowired(required = false) TenantSecurityMetrics metrics) {
        this.metrics = metrics;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        String message = ex.getMessage() != null ? ex.getMessage() : "Bad request";

        // Detectar mismatch de tenant pelas mensagens padronizadas dos Services
        if (message.contains("não pertence ao tenant atual")) {
            String requestId = request.getHeader("X-Request-ID");
            String uri = request.getRequestURI();
            String method = request.getMethod();
            Long tenantId = TenantContext.getCurrentTenantId();

            // PADRÃO BIG TECH: Null-safe check - incrementa métricas apenas se disponível
            if (metrics != null) {
                metrics.incrementMismatch("tenant_mismatch", uri, method);
            }
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


