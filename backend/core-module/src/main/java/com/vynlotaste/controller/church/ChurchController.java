package com.vynlotaste.controller.church;
// touch: redeploy note (commit 112b089, d96f8ca, ce2d2e6, 0cc13bc, 2fb4255) - comentário leve sem impacto funcional

import com.vynlotaste.entity.church.Church;
import com.vynlotaste.service.church.ChurchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * ============================================================================
 * Controller para Church - EKKLESIA
 * ============================================================================
 * Fase 1: Rota corrigida - removido /api do @RequestMapping (context-path=/api)
 * Rota final: /api/v1/ekklesia/churches
 * ============================================================================
 * 
 * ENDPOINTS:
 * GET    /api/v1/ekklesia/churches         → Listar igrejas (paginação)
 * GET    /api/v1/ekklesia/churches/{id}    → Buscar igreja por ID
 * POST   /api/v1/ekklesia/churches         → Criar nova igreja
 * PUT    /api/v1/ekklesia/churches/{id}    → Atualizar igreja
 * DELETE /api/v1/ekklesia/churches/{id}    → Deletar igreja (soft delete)
 * 
 * SEGURANÇA: Todos os endpoints exigem autenticação
 * MULTI-TENANCY: Isolamento automático por tenant_id
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Slf4j
@RestController
@RequestMapping("/v1/ekklesia/churches")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ChurchController {
    
    private final ChurchService churchService;
    
    /**
     * Listar todas as igrejas com paginação
     * GET /api/v1/ekklesia/churches?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<Church>> findAll(
        @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(churchService.findAll(pageable));
    }
    
    /**
     * Buscar igreja por ID
     * GET /api/v1/ekklesia/churches/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Church> findById(@PathVariable Long id) {
        return ResponseEntity.ok(churchService.findById(id));
    }
    
    /**
     * Criar nova igreja
     * POST /api/v1/ekklesia/churches
     * Body: { "porte": "Estadual", "cidade": "Londrina", "pastor_nome": "João Silva", ... }
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_CHURCHES')")
    public ResponseEntity<Church> create(@RequestBody Church church) {
        return ResponseEntity.ok(churchService.create(church));
    }
    
    /**
     * Atualizar igreja existente
     * PUT /api/v1/ekklesia/churches/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_CHURCHES')")
    public ResponseEntity<Church> update(@PathVariable Long id, @RequestBody Church church) {
        return ResponseEntity.ok(churchService.update(id, church));
    }
    
    /**
     * Deletar igreja (soft delete)
     * DELETE /api/v1/ekklesia/churches/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_CHURCHES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        churchService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

