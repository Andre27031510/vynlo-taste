package com.vynlotaste.entity;

import jakarta.persistence.*;
// Lombok removido - usando getters/setters manuais
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// Construtores e getters/setters manuais
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user", columnList = "user_id"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_entity", columnList = "entity_type"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
    @Index(name = "idx_audit_ip", columnList = "ip_address")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_email", length = 100)
    private String userEmail;

    @Column(name = "user_role", length = 20)
    private String userRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuditAction action;

    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "old_values", columnDefinition = "TEXT")
    private String oldValues;

    @Column(name = "new_values", columnDefinition = "TEXT")
    private String newValues;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "request_url", length = 500)
    private String requestUrl;

    @Column(name = "request_method", length = 10)
    private String requestMethod;

    @Column(name = "response_status")
    private Integer responseStatus;

    @Column(name = "execution_time")
    private Long executionTime; // em milissegundos

    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    public enum AuditAction {
        CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT, 
        APPROVE, REJECT, ASSIGN, TRANSFER, BACKUP, RESTORE, CONFIG_CHANGE
    }

    // Métodos de negócio
    public boolean isSuccessful() {
        return responseStatus != null && responseStatus < 400;
    }

    public boolean isError() {
        return responseStatus != null && responseStatus >= 400;
    }

    public String getActionDescription() {
        switch (action) {
            case CREATE: return "Criação";
            case READ: return "Leitura";
            case UPDATE: return "Atualização";
            case DELETE: return "Exclusão";
            case LOGIN: return "Login";
            case LOGOUT: return "Logout";
            case EXPORT: return "Exportação";
            case IMPORT: return "Importação";
            case APPROVE: return "Aprovação";
            case REJECT: return "Rejeição";
            case ASSIGN: return "Atribuição";
            case TRANSFER: return "Transferência";
            case BACKUP: return "Backup";
            case RESTORE: return "Restauração";
            case CONFIG_CHANGE: return "Mudança de Configuração";
            default: return action.name();
        }
    }

    public String getEntityDescription() {
        if (entityType == null) return "N/A";
        
        switch (entityType.toLowerCase()) {
            case "user": return "Usuário";
            case "order": return "Pedido";
            case "product": return "Produto";
            case "restaurant": return "Restaurante";
            case "delivery": return "Entrega";
            case "payment": return "Pagamento";
            case "financial": return "Financeiro";
            case "report": return "Relatório";
            default: return entityType;
        }
    }

    // Construtores
    public AuditLog() {}

    public AuditLog(Long userId, String userEmail, String userRole, AuditAction action, String entityType, Long entityId) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public AuditAction getAction() { return action; }
    public void setAction(AuditAction action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getOldValues() { return oldValues; }
    public void setOldValues(String oldValues) { this.oldValues = oldValues; }

    public String getNewValues() { return newValues; }
    public void setNewValues(String newValues) { this.newValues = newValues; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getRequestUrl() { return requestUrl; }
    public void setRequestUrl(String requestUrl) { this.requestUrl = requestUrl; }

    public String getRequestMethod() { return requestMethod; }
    public void setRequestMethod(String requestMethod) { this.requestMethod = requestMethod; }

    public Integer getResponseStatus() { return responseStatus; }
    public void setResponseStatus(Integer responseStatus) { this.responseStatus = responseStatus; }

    public Long getExecutionTime() { return executionTime; }
    public void setExecutionTime(Long executionTime) { this.executionTime = executionTime; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
