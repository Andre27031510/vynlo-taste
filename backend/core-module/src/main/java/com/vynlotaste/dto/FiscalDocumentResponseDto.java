package com.vynlotaste.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Dados de resposta do documento fiscal")
public class FiscalDocumentResponseDto {

    @Schema(description = "ID único do documento", example = "1")
    private Long id;

    @Schema(description = "Número do documento", example = "000001")
    private String number;

    @Schema(description = "Tipo do documento", example = "NFE")
    private String type;

    @Schema(description = "Status do documento", example = "AUTHORIZED")
    private String status;

    @Schema(description = "Nome do cliente", example = "João Silva")
    private String customer;

    @Schema(description = "Valor do documento", example = "1250.00")
    private BigDecimal value;

    @Schema(description = "Data de emissão", example = "2024-01-15")
    private LocalDate issueDate;

    @Schema(description = "Status no SEFAZ", example = "AUTHORIZED")
    private String sefazStatus;

    @Schema(description = "Indica se possui conteúdo XML", example = "true")
    private Boolean hasXmlContent;

    @Schema(description = "Conteúdo XML do documento (apenas se solicitado)")
    private String xmlContent;

    @Schema(description = "Data de criação", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "Data de atualização", example = "2024-01-15T10:30:00")
    private LocalDateTime updatedAt;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public String getSefazStatus() { return sefazStatus; }
    public void setSefazStatus(String sefazStatus) { this.sefazStatus = sefazStatus; }

    public Boolean getHasXmlContent() { return hasXmlContent; }
    public void setHasXmlContent(Boolean hasXmlContent) { this.hasXmlContent = hasXmlContent; }

    public String getXmlContent() { return xmlContent; }
    public void setXmlContent(String xmlContent) { this.xmlContent = xmlContent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}