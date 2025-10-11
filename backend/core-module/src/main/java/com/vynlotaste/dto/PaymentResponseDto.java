package com.vynlotaste.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "Dados de resposta do pagamento")
public class PaymentResponseDto {

    @Schema(description = "ID único do pagamento", example = "1")
    private Long id;

    @Schema(description = "ID do pedido", example = "1")
    private Long orderId;

    @Schema(description = "Número do pedido", example = "ORD-2024-001")
    private String orderNumber;

    @Schema(description = "Valor do pagamento", example = "150.75")
    private BigDecimal amount;

    @Schema(description = "Método de pagamento", example = "PIX")
    private String method;

    @Schema(description = "Provedor do pagamento", example = "STRIPE")
    private String provider;

    @Schema(description = "Status do pagamento", example = "APPROVED")
    private String status;

    @Schema(description = "ID da transação externa", example = "TXN123456789")
    private String transactionId;

    @Schema(description = "Metadados em formato JSON", example = "{\"gateway\": \"stripe\", \"fee\": 2.50}")
    private String metadata;

    @Schema(description = "Data de criação", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "Data de atualização", example = "2024-01-15T10:30:00")
    private LocalDateTime updatedAt;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}