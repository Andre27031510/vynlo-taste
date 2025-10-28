package com.vynlotaste.service.church;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.church.Church;
import com.vynlotaste.repository.church.ChurchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ============================================================================
 * Service para Church - EKKLESIA
 * ============================================================================
 * 
 * SEGURANÇA MULTI-TENANCY:
 * - Todos os métodos validam tenant_id
 * - Igreja X não acessa dados de Igreja Y
 * - Super Admin vê TODAS as igrejas
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChurchService {
    
    private final ChurchRepository churchRepository;
    
    /**
     * Listar todas as igrejas com paginação
     * MULTI-TENANCY: Filtra por tenant_id
     */
    @Transactional(readOnly = true)
    public Page<Church> findAll(Pageable pageable) {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (tenantId == null) {
            if (TenantContext.isSuperAdmin()) {
                return churchRepository.findAll(pageable);
            }
            return Page.empty(pageable);
        }
        
        return churchRepository.findAllByTenantId(tenantId, pageable);
    }
    
    /**
     * Buscar igreja por ID
     * MULTI-TENANCY: Valida tenant_id
     */
    @Transactional(readOnly = true)
    public Church findById(Long id) {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (TenantContext.isSuperAdmin()) {
            return churchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Igreja não encontrada: " + id));
        }
        
        if (tenantId == null) {
            throw new RuntimeException("Tenant não definido");
        }
        
        return churchRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Igreja não encontrada ou sem acesso: " + id));
    }
    
    /**
     * Criar nova igreja
     * MULTI-TENANCY: Define tenant_id automaticamente
     * Nome da igreja: "PORTE CIDADE" (ex: "Estadual Londrina")
     */
    @Transactional
    public Church create(Church church) {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (tenantId == null && !TenantContext.isSuperAdmin()) {
            throw new RuntimeException("Tenant não definido");
        }
        
        // Gerar nome da igreja: "Porte Cidade"
        String nomeIgreja = church.getPorte() + " " + church.getCidade();
        church.setNomeIgreja(nomeIgreja);
        church.setTenantId(tenantId);
        church.setStatus("ACTIVE");
        
        Church saved = churchRepository.save(church);
        log.info("✅ Igreja criada: {} (tenant_id={})", saved.getNomeIgreja(), saved.getTenantId());
        
        return saved;
    }
    
    /**
     * Atualizar igreja existente
     * MULTI-TENANCY: Valida tenant_id
     */
    @Transactional
    public Church update(Long id, Church church) {
        Church existing = findById(id);
        
        existing.setPorte(church.getPorte());
        existing.setCidade(church.getCidade());
        
        // Atualizar nome da igreja
        String nomeIgreja = church.getPorte() + " " + church.getCidade();
        existing.setNomeIgreja(nomeIgreja);
        
        existing.setTotvs(church.getTotvs());
        existing.setPastorNome(church.getPastorNome());
        existing.setPastorTelefone(church.getPastorTelefone());
        existing.setFinanceiraNome(church.getFinanceiraNome());
        existing.setFinanceiraTelefone(church.getFinanceiraTelefone());
        existing.setEndereco(church.getEndereco());
        existing.setNotes(church.getNotes());
        
        Church updated = churchRepository.save(existing);
        log.info("✅ Igreja atualizada: {} (tenant_id={})", updated.getNomeIgreja(), updated.getTenantId());
        
        return updated;
    }
    
    /**
     * Deletar igreja (soft delete)
     * MULTI-TENANCY: Valida tenant_id
     */
    @Transactional
    public void delete(Long id) {
        Church existing = findById(id);
        
        existing.setDeletedAt(java.time.LocalDateTime.now());
        existing.setStatus("INACTIVE");
        
        churchRepository.save(existing);
        log.info("✅ Igreja deletada: {} (tenant_id={})", existing.getNomeIgreja(), existing.getTenantId());
    }
}

