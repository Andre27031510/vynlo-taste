package com.vynlotaste.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Dados de resposta da transação financeira")
public class FinancialResponseDto {

    @Schema(description = "ID único da transação", example = "1")
    private Long id;

    @Schema(description = "Tipo da transação", example = "INCOME")
    private String type;

    @Schema(description = "Valor da transação", example = "1500.50")
    private BigDecimal amount;

    @Schema(description = "Descrição da transação", example = "Venda de produtos")
    private String description;

    @Schema(description = "Categoria da transação", example = "Vendas")
    private String category;

    @Schema(description = "Data da transação", example = "2024-01-15")
    private LocalDate date;

    @Schema(description = "Status da transação", example = "CONFIRMED")
    private String status;

    @Schema(description = "ID do usuário", example = "1")
    private Long userId;

    @Schema(description = "Nome do usuário", example = "João Silva")
    private String userName;

    @Schema(description = "Data de criação", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "Data de atualização", example = "2024-01-15T10:30:00")
    private LocalDateTime updatedAt;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}