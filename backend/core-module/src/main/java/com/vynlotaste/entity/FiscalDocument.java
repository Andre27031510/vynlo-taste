package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing fiscal documents (NFe, NFCe, CTe)
 * Used for fiscal compliance and SEFAZ integration
 */
@Entity
@Table(name = "fiscal_documents", indexes = {
    @Index(name = "idx_fiscal_number", columnList = "number"),
    @Index(name = "idx_fiscal_type", columnList = "type"),
    @Index(name = "idx_fiscal_status", columnList = "status"),
    @Index(name = "idx_fiscal_issue_date", columnList = "issue_date"),
    @Index(name = "idx_fiscal_sefaz_status", columnList = "sefaz_status"),
    @Index(name = "idx_fiscal_customer", columnList = "customer")
})
public class FiscalDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Número do documento é obrigatório")
    @Size(min = 1, max = 50, message = "Número deve ter entre 1 e 50 caracteres")
    @Column(nullable = false, length = 50)
    private String number;

    @NotBlank(message = "Tipo do documento é obrigatório")
    @Pattern(regexp = "^(NFE|NFCE|CTE)$", message = "Tipo deve ser NFE, NFCE ou CTE")
    @Column(nullable = false, length = 10)
    private String type;

    @NotBlank(message = "Status é obrigatório")
    @Pattern(regexp = "^(PENDING|AUTHORIZED|CANCELLED|REJECTED)$", message = "Status deve ser PENDING, AUTHORIZED, CANCELLED ou REJECTED")
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @NotBlank(message = "Cliente é obrigatório")
    @Size(min = 2, max = 200, message = "Cliente deve ter entre 2 e 200 caracteres")
    @Column(nullable = false, length = 200)
    private String customer;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @DecimalMax(value = "999999.99", message = "Valor deve ser menor que R$ 999.999,99")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal value;

    @NotNull(message = "Data de emissão é obrigatória")
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Size(max = 100, message = "Status SEFAZ deve ter no máximo 100 caracteres")
    @Column(name = "sefaz_status", length = 100)
    private String sefazStatus;

    @Column(name = "xml_content", columnDefinition = "TEXT")
    private String xmlContent;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Métodos de negócio
    public boolean isPending() {
        return "PENDING".equals(status);
    }

    public boolean isAuthorized() {
        return "AUTHORIZED".equals(status);
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(status);
    }

    public boolean isRejected() {
        return "REJECTED".equals(status);
    }

    public boolean isNFe() {
        return "NFE".equals(type);
    }

    public boolean isNFCe() {
        return "NFCE".equals(type);
    }

    public boolean isCTe() {
        return "CTE".equals(type);
    }

    public boolean hasXmlContent() {
        return xmlContent != null && !xmlContent.trim().isEmpty();
    }

    // Construtores
    public FiscalDocument() {}

    public FiscalDocument(String number, String type, String customer, BigDecimal value, LocalDate issueDate) {
        this.number = number;
        this.type = type;
        this.customer = customer;
        this.value = value;
        this.issueDate = issueDate;
    }

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

    public String getXmlContent() { return xmlContent; }
    public void setXmlContent(String xmlContent) { this.xmlContent = xmlContent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}