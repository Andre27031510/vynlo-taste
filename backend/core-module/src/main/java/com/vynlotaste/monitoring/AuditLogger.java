package com.vynlotaste.monitoring;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuditLogger {

    private final ObjectMapper objectMapper;

    public void logUserAction(String action, String userId, Object details) {
        try {
            Map<String, Object> auditEvent = new HashMap<>();
            auditEvent.put("timestamp", LocalDateTime.now());
            auditEvent.put("action", action);
            auditEvent.put("userId", userId);
            auditEvent.put("requestId", MDC.get("requestId"));
            auditEvent.put("traceId", MDC.get("traceId"));
            auditEvent.put("details", details);
            
            String auditJson = objectMapper.writeValueAsString(auditEvent);
            log.info("AUDIT: {}", auditJson);
            
        } catch (Exception e) {
            log.error("Failed to log audit event", e);
        }
    }

    public void logOrderAction(String action, String orderId, String userId, Object details) {
        try {
            Map<String, Object> auditEvent = new HashMap<>();
            auditEvent.put("timestamp", LocalDateTime.now());
            auditEvent.put("action", action);
            auditEvent.put("orderId", orderId);
            auditEvent.put("userId", userId);
            auditEvent.put("requestId", MDC.get("requestId"));
            auditEvent.put("traceId", MDC.get("traceId"));
            auditEvent.put("details", details);
            
            String auditJson = objectMapper.writeValueAsString(auditEvent);
            log.info("ORDER_AUDIT: {}", auditJson);
            
        } catch (Exception e) {
            log.error("Failed to log order audit event", e);
        }
    }

    public void logSecurityEvent(String event, String userId, String ipAddress, Object details) {
        try {
            Map<String, Object> securityEvent = new HashMap<>();
            securityEvent.put("timestamp", LocalDateTime.now());
            securityEvent.put("event", event);
            securityEvent.put("userId", userId);
            securityEvent.put("ipAddress", ipAddress);
            securityEvent.put("requestId", MDC.get("requestId"));
            securityEvent.put("traceId", MDC.get("traceId"));
            securityEvent.put("details", details);
            
            String securityJson = objectMapper.writeValueAsString(securityEvent);
            log.warn("SECURITY_AUDIT: {}", securityJson);
            
        } catch (Exception e) {
            log.error("Failed to log security audit event", e);
        }
    }
}