package com.vynlotaste.dto;

import com.vynlotaste.dto.validation.ValidationGroups;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Dados para criação/atualização de transação financeira")
public class FinancialRequestDto {

    @NotBlank(message = "Tipo é obrigatório", groups = ValidationGroups.Create.class)
    @Pattern(regexp = "^(INCOME|EXPENSE)$", message = "Tipo deve ser INCOME ou EXPENSE")
    @Schema(description = "Tipo da transação", example = "INCOME", required = true, allowableValues = {"INCOME", "EXPENSE"})
    private String type;

    @NotNull(message = "Valor é obrigatório", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999.99", message = "Valor deve ser menor que R$ 999.999,99")
    @Schema(description = "Valor da transação", example = "1500.50", required = true)
    private BigDecimal amount;

    @NotBlank(message = "Descrição é obrigatória", groups = ValidationGroups.Create.class)
    @Size(min = 3, max = 500, message = "Descrição deve ter entre 3 e 500 caracteres")
    @Schema(description = "Descrição da transação", example = "Venda de produtos", required = true)
    private String description;

    @NotBlank(message = "Categoria é obrigatória", groups = ValidationGroups.Create.class)
    @Size(min = 2, max = 100, message = "Categoria deve ter entre 2 e 100 caracteres")
    @Schema(description = "Categoria da transação", example = "Vendas", required = true)
    private String category;

    @NotNull(message = "Data é obrigatória", groups = ValidationGroups.Create.class)
    @Schema(description = "Data da transação", example = "2024-01-15", required = true)
    private LocalDate date;

    @Pattern(regexp = "^(PENDING|CONFIRMED|CANCELLED)$", message = "Status deve ser PENDING, CONFIRMED ou CANCELLED")
    @Schema(description = "Status da transação", example = "PENDING", allowableValues = {"PENDING", "CONFIRMED", "CANCELLED"})
    private String status;

    @NotNull(message = "Usuário é obrigatório", groups = ValidationGroups.Create.class)
    @Schema(description = "ID do usuário", example = "1", required = true)
    private Long userId;

    // Getters e Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}