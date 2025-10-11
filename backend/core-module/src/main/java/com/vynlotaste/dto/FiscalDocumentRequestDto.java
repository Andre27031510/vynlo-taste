package com.vynlotaste.dto;

import com.vynlotaste.dto.validation.ValidationGroups;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Dados para criação/atualização de documento fiscal")
public class FiscalDocumentRequestDto {

    @NotBlank(message = "Número é obrigatório", groups = ValidationGroups.Create.class)
    @Size(min = 1, max = 50, message = "Número deve ter entre 1 e 50 caracteres")
    @Schema(description = "Número do documento", example = "000001", required = true)
    private String number;

    @NotBlank(message = "Tipo é obrigatório", groups = ValidationGroups.Create.class)
    @Pattern(regexp = "^(NFE|NFCE|CTE)$", message = "Tipo deve ser NFE, NFCE ou CTE")
    @Schema(description = "Tipo do documento", example = "NFE", required = true, allowableValues = {"NFE", "NFCE", "CTE"})
    private String type;

    @Pattern(regexp = "^(PENDING|AUTHORIZED|CANCELLED|REJECTED)$", message = "Status deve ser PENDING, AUTHORIZED, CANCELLED ou REJECTED")
    @Schema(description = "Status do documento", example = "PENDING", allowableValues = {"PENDING", "AUTHORIZED", "CANCELLED", "REJECTED"})
    private String status;

    @NotBlank(message = "Cliente é obrigatório", groups = ValidationGroups.Create.class)
    @Size(min = 2, max = 200, message = "Cliente deve ter entre 2 e 200 caracteres")
    @Schema(description = "Nome do cliente", example = "João Silva", required = true)
    private String customer;

    @NotNull(message = "Valor é obrigatório", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999.99", message = "Valor deve ser menor que R$ 999.999,99")
    @Schema(description = "Valor do documento", example = "1250.00", required = true)
    private BigDecimal value;

    @NotNull(message = "Data de emissão é obrigatória", groups = ValidationGroups.Create.class)
    @Schema(description = "Data de emissão", example = "2024-01-15", required = true)
    private LocalDate issueDate;

    @Size(max = 100, message = "Status SEFAZ deve ter no máximo 100 caracteres")
    @Schema(description = "Status no SEFAZ", example = "AUTHORIZED")
    private String sefazStatus;

    @Schema(description = "Conteúdo XML do documento")
    private String xmlContent;

    // Getters e Setters
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

    public String getXmlContent() { return xmlContent; }
    public void setXmlContent(String xmlContent) { this.xmlContent = xmlContent; }
}