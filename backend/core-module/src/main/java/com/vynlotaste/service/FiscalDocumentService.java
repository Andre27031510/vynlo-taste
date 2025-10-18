package com.vynlotaste.service;

import com.vynlotaste.entity.FiscalDocument;
import com.vynlotaste.repository.FiscalDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service for fiscal document operations
 * Handles business logic for fiscal compliance and SEFAZ integration
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FiscalDocumentService {

    private final FiscalDocumentRepository fiscalDocumentRepository;

    @Transactional(readOnly = true)
    public Page<FiscalDocument> findAll(Pageable pageable) {
        try {
            log.info("Buscando todos os documentos fiscais - página: {}, tamanho: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
            
            // MULTI-TENANCY: Filtrar por tenant_id
            Page<FiscalDocument> documents;
            if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
                log.debug("🔑 Super Admin: retornando TODOS os documentos fiscais");
                documents = fiscalDocumentRepository.findAll(pageable);
            } else {
                Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
                if (tenantId == null) {
                    log.warn("⚠️ Tenant não definido - retornando página vazia");
                    return Page.empty(pageable);
                }
                log.debug("👤 Cliente (tenant_id={}): retornando documentos do tenant", tenantId);
                documents = fiscalDocumentRepository.findAllByTenantId(tenantId, pageable);
            }
            
            log.info("Documentos encontrados: {} de {}", 
                documents.getNumberOfElements(), documents.getTotalElements());
            
            return documents;
        } catch (Exception e) {
            log.error("Erro ao buscar documentos fiscais", e);
            throw new RuntimeException("Erro interno ao buscar documentos", e);
        }
    }

    @Transactional
    public FiscalDocument createDocument(FiscalDocumentRequestDto dto) {
        try {
            log.info("Criando novo documento fiscal - tipo: {}, número: {}", dto.getType(), dto.getNumber());
            
            // Validações de negócio
            validateDocumentRequest(dto);
            
            FiscalDocument document = new FiscalDocument();
            document.setNumber(dto.getNumber());
            document.setType(dto.getType());
            document.setCustomer(dto.getCustomer());
            document.setValue(dto.getValue());
            document.setIssueDate(dto.getIssueDate());
            document.setStatus("PENDING");
            document.setSefazStatus("PENDING");
            document.setXmlContent(dto.getXmlContent());
            
            // MULTI-TENANCY: Setar tenant_id automaticamente
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            document.setTenantId(tenantId);
            log.debug("🔒 FiscalDocument será criado com tenant_id={}", tenantId);
            
            FiscalDocument savedDocument = fiscalDocumentRepository.save(document);
            
            log.info("✅ Documento fiscal criado: ID={}, tipo={}, número={}", 
                savedDocument.getId(), savedDocument.getType(), savedDocument.getNumber());
            
            return savedDocument;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao criar documento: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao criar documento fiscal", e);
            throw new RuntimeException("Erro interno ao criar documento", e);
        }
    }

    @Transactional
    public FiscalDocument emitNFe(NFeRequestDto dto) {
        try {
            log.info("Emitindo NFe - cliente: {}, valor: {}", dto.getCustomer(), dto.getValue());
            
            // Validações específicas para NFe
            validateNFeRequest(dto);
            
            String nfeNumber = generateNFeNumber();
            
            FiscalDocument nfe = new FiscalDocument();
            nfe.setNumber(nfeNumber);
            nfe.setType("NFE");
            nfe.setCustomer(dto.getCustomer());
            nfe.setValue(dto.getValue());
            nfe.setIssueDate(java.time.LocalDate.now());
            nfe.setStatus("PENDING");
            nfe.setSefazStatus("PROCESSING");
            
            // Simular geração de XML
            String xmlContent = generateNFeXML(dto);
            nfe.setXmlContent(xmlContent);
            
            // MULTI-TENANCY: Setar tenant_id automaticamente
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            nfe.setTenantId(tenantId);
            log.debug("🔒 FiscalDocument NFe será criado com tenant_id={}", tenantId);
            
            FiscalDocument savedNFe = fiscalDocumentRepository.save(nfe);
            
            // Simular envio para SEFAZ
            processSEFAZSubmission(savedNFe);
            
            log.info("✅ NFe emitida: ID={}, número={}, status={}", 
                savedNFe.getId(), savedNFe.getNumber(), savedNFe.getSefazStatus());
            
            return savedNFe;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao emitir NFe: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao emitir NFe", e);
            throw new RuntimeException("Erro interno ao emitir NFe", e);
        }
    }

    @Transactional(readOnly = true)
    public FiscalDocument findById(Long id) {
        try {
            log.info("Buscando documento fiscal por ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID do documento deve ser um número positivo");
            }
            
            FiscalDocument document = fiscalDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado com ID: " + id));
            
            log.info("Documento encontrado - ID: {}, tipo: {}, número: {}", 
                document.getId(), document.getType(), document.getNumber());
            
            return document;
        } catch (Exception e) {
            log.error("Erro ao buscar documento por ID: {}", id, e);
            throw new RuntimeException("Erro interno ao buscar documento", e);
        }
    }

    @Transactional(readOnly = true)
    public Map<String, String> getSEFAZStatus() {
        try {
            log.info("Consultando status do SEFAZ");
            
            Map<String, String> status = new HashMap<>();
            status.put("connection", "ONLINE");
            status.put("service", "AVAILABLE");
            status.put("lastUpdate", java.time.LocalDateTime.now().toString());
            status.put("environment", "PRODUCTION");
            
            log.info("Status SEFAZ consultado com sucesso");
            
            return status;
        } catch (Exception e) {
            log.error("Erro ao consultar status SEFAZ", e);
            throw new RuntimeException("Erro interno ao consultar SEFAZ", e);
        }
    }

    private void validateDocumentRequest(FiscalDocumentRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Dados do documento não podem ser nulos");
        }
        
        if (dto.getNumber() == null || dto.getNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Número do documento é obrigatório");
        }
        
        // Verificar se número já existe
        if (fiscalDocumentRepository.findByNumber(dto.getNumber()).isPresent()) {
            throw new IllegalArgumentException("Número do documento já existe: " + dto.getNumber());
        }
        
        if (dto.getType() == null || (!dto.getType().equals("NFE") && !dto.getType().equals("NFCE") && !dto.getType().equals("CTE"))) {
            throw new IllegalArgumentException("Tipo deve ser NFE, NFCE ou CTE");
        }
        
        if (dto.getCustomer() == null || dto.getCustomer().trim().isEmpty()) {
            throw new IllegalArgumentException("Cliente é obrigatório");
        }
        
        if (dto.getValue() == null || dto.getValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        
        if (dto.getIssueDate() == null) {
            throw new IllegalArgumentException("Data de emissão é obrigatória");
        }
    }

    private void validateNFeRequest(NFeRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Dados da NFe não podem ser nulos");
        }
        
        if (dto.getCustomer() == null || dto.getCustomer().trim().isEmpty()) {
            throw new IllegalArgumentException("Cliente é obrigatório");
        }
        
        if (dto.getValue() == null || dto.getValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
    }

    private String generateNFeNumber() {
        // Simular geração de número sequencial
        long timestamp = System.currentTimeMillis();
        String number = "NFE" + timestamp;
        
        // Garantir que o número é único
        while (fiscalDocumentRepository.findByNumber(number).isPresent()) {
            timestamp++;
            number = "NFE" + timestamp;
        }
        
        return number;
    }

    private String generateNFeXML(NFeRequestDto dto) {
        // Simular geração de XML da NFe
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
               "<NFe>" +
               "<infNFe>" +
               "<dest><xNome>" + dto.getCustomer() + "</xNome></dest>" +
               "<total><vNF>" + dto.getValue() + "</vNF></total>" +
               "</infNFe>" +
               "</NFe>";
    }

    private void processSEFAZSubmission(FiscalDocument nfe) {
        try {
            log.info("Processando documento no SEFAZ - ID: {}", nfe.getId());
            
            // Simular processamento SEFAZ
            Thread.sleep(100); // Simular delay de processamento
            
            // Simular aprovação automática (90% de sucesso)
            boolean approved = Math.random() > 0.1;
            
            if (approved) {
                nfe.setStatus("AUTHORIZED");
                nfe.setSefazStatus("AUTHORIZED");
                log.info("✅ Documento autorizado pelo SEFAZ - ID: {}", nfe.getId());
            } else {
                nfe.setStatus("REJECTED");
                nfe.setSefazStatus("REJECTED - Erro de validação SEFAZ");
                log.warn("❌ Documento rejeitado pelo SEFAZ - ID: {}", nfe.getId());
            }
            
            fiscalDocumentRepository.save(nfe);
            
        } catch (Exception e) {
            log.error("❌ Erro no processamento SEFAZ - NFe ID: {}", nfe.getId(), e);
            nfe.setStatus("REJECTED");
            nfe.setSefazStatus("REJECTED - Erro de comunicação");
            fiscalDocumentRepository.save(nfe);
        }
    }

    @Transactional
    public FiscalDocument updateDocumentStatus(Long id, String status) {
        try {
            log.info("Atualizando status do documento - ID: {}, novo status: {}", id, status);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID do documento deve ser um número positivo");
            }
            
            if (status == null || (!status.equals("PENDING") && !status.equals("AUTHORIZED") && 
                                  !status.equals("CANCELLED") && !status.equals("REJECTED"))) {
                throw new IllegalArgumentException("Status deve ser PENDING, AUTHORIZED, CANCELLED ou REJECTED");
            }
            
            FiscalDocument document = findById(id);
            document.setStatus(status);
            
            FiscalDocument updatedDocument = fiscalDocumentRepository.save(document);
            
            log.info("✅ Status do documento atualizado: ID={}, status={}", 
                updatedDocument.getId(), updatedDocument.getStatus());
            
            return updatedDocument;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao atualizar status do documento ID {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao atualizar status do documento ID {}", id, e);
            throw new RuntimeException("Erro interno ao atualizar status", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<FiscalDocument> findByType(String type, Pageable pageable) {
        try {
            log.info("Buscando documentos por tipo: {}", type);
            
            if (type == null || (!type.equals("NFE") && !type.equals("NFCE") && !type.equals("CTE"))) {
                throw new IllegalArgumentException("Tipo deve ser NFE, NFCE ou CTE");
            }
            
            Page<FiscalDocument> documents = fiscalDocumentRepository.findByType(type, pageable);
            
            log.info("✅ Documentos encontrados por tipo {}: {}", type, documents.getTotalElements());
            
            return documents;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por tipo: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar documentos por tipo: {}", type, e);
            throw new RuntimeException("Erro interno ao buscar documentos", e);
        }
    }

    @Transactional(readOnly = true)
    public Optional<FiscalDocument> findByNumber(String number) {
        try {
            log.info("Buscando documento por número: {}", number);
            
            if (number == null || number.trim().isEmpty()) {
                throw new IllegalArgumentException("Número do documento é obrigatório");
            }
            
            Optional<FiscalDocument> document = fiscalDocumentRepository.findByNumber(number);
            
            if (document.isPresent()) {
                log.info("✅ Documento encontrado por número: {}", number);
            } else {
                log.info("Nenhum documento encontrado para número: {}", number);
            }
            
            return document;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por número: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar documento por número: {}", number, e);
            throw new RuntimeException("Erro interno ao buscar documento", e);
        }
    }

    // DTOs internos para request
    public static class FiscalDocumentRequestDto {
        private String number;
        private String type;
        private String customer;
        private BigDecimal value;
        private java.time.LocalDate issueDate;
        private String xmlContent;

        // Getters e Setters
        public String getNumber() { return number; }
        public void setNumber(String number) { this.number = number; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getCustomer() { return customer; }
        public void setCustomer(String customer) { this.customer = customer; }
        
        public BigDecimal getValue() { return value; }
        public void setValue(BigDecimal value) { this.value = value; }
        
        public java.time.LocalDate getIssueDate() { return issueDate; }
        public void setIssueDate(java.time.LocalDate issueDate) { this.issueDate = issueDate; }
        
        public String getXmlContent() { return xmlContent; }
        public void setXmlContent(String xmlContent) { this.xmlContent = xmlContent; }
    }

    public static class NFeRequestDto {
        private String customer;
        private BigDecimal value;

        // Getters e Setters
        public String getCustomer() { return customer; }
        public void setCustomer(String customer) { this.customer = customer; }
        
        public BigDecimal getValue() { return value; }
        public void setValue(BigDecimal value) { this.value = value; }
    }
}