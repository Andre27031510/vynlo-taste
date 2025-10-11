package com.vynlotaste.dto;

import com.vynlotaste.dto.validation.ValidationGroups;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Schema(description = "Dados para criação/atualização de pagamento")
public class PaymentRequestDto {

    @Schema(description = "ID do pedido", example = "1")
    private Long orderId;

    @NotNull(message = "Valor é obrigatório", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999.99", message = "Valor deve ser menor que R$ 999.999,99")
    @Schema(description = "Valor do pagamento", example = "150.75", required = true)
    private BigDecimal amount;

    @NotBlank(message = "Método é obrigatório", groups = ValidationGroups.Create.class)
    @Pattern(regexp = "^(CREDIT_CARD|DEBIT|PIX|CASH)$", message = "Método deve ser CREDIT_CARD, DEBIT, PIX ou CASH")
    @Schema(description = "Método de pagamento", example = "PIX", required = true, allowableValues = {"CREDIT_CARD", "DEBIT", "PIX", "CASH"})
    private String method;

    @Size(max = 50, message = "Provedor deve ter no máximo 50 caracteres")
    @Schema(description = "Provedor do pagamento", example = "STRIPE")
    private String provider;

    @Pattern(regexp = "^(PENDING|APPROVED|FAILED|REFUNDED)$", message = "Status deve ser PENDING, APPROVED, FAILED ou REFUNDED")
    @Schema(description = "Status do pagamento", example = "PENDING", allowableValues = {"PENDING", "APPROVED", "FAILED", "REFUNDED"})
    private String status;

    @Size(max = 200, message = "ID da transação deve ter no máximo 200 caracteres")
    @Schema(description = "ID da transação externa", example = "TXN123456789")
    private String transactionId;

    @Size(max = 2000, message = "Metadata deve ter no máximo 2000 caracteres")
    @Schema(description = "Metadados em formato JSON", example = "{\"gateway\": \"stripe\", \"fee\": 2.50}")
    private String metadata;

    // Getters e Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

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
}