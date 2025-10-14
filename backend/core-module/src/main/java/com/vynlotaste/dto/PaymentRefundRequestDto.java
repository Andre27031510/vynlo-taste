package com.vynlotaste.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

// Created: 2025-10-14 19:00 UTC | Real refunds request DTO

@Data
public class PaymentRefundRequestDto {

    @NotNull(message = "ID do pagamento é obrigatório")
    private Long paymentId;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal amount;

    @NotBlank(message = "Motivo é obrigatório")
    @Size(max = 500, message = "Motivo deve ter no máximo 500 caracteres")
    private String reason;

    @Size(max = 1000, message = "Observações devem ter no máximo 1000 caracteres")
    private String notes;
}
