package com.vynlotaste.controller.church;
// touch: redeploy note (commit 0b28909) - comentário leve sem impacto funcional - atualizado para forçar push

import com.vynlotaste.entity.church.Member;
import com.vynlotaste.service.church.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

/**
 * ============================================================================
 * Controller para Member - EKKLESIA
 * ============================================================================
 * Fase 1: Rota corrigida - removido /api do @RequestMapping (context-path=/api)
 * Rota final: /api/v1/ekklesia/members
 * ============================================================================
 * 
 * ENDPOINTS:
 * GET    /api/v1/ekklesia/members         → Listar membros (paginação)
 * GET    /api/v1/ekklesia/members/{id}    → Buscar membro por ID
 * POST   /api/v1/ekklesia/members         → Criar novo membro
 * PUT    /api/v1/ekklesia/members/{id}    → Atualizar membro
 * DELETE /api/v1/ekklesia/members/{id}    → Deletar membro (soft delete)
 * GET    /api/v1/ekklesia/members/filters → Buscar com filtros avançados
 * GET    /api/v1/ekklesia/members/stats   → Estatísticas de membros
 * POST   /api/v1/ekklesia/members/import  → Importar membros via Excel (.xlsx)
 * GET    /api/v1/ekklesia/members/export  → Exportar membros para Excel (.xlsx)
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
@RequestMapping("/v1/ekklesia/members")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class MemberController {
    
    private final MemberService memberService;
    
    /**
     * Listar todos os membros com paginação
     * GET /api/v1/ekklesia/members?page=0&size=10&sort=name,asc
     */
    @GetMapping
    public ResponseEntity<Page<Member>> findAll(
        @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(memberService.findAll(pageable));
    }
    
    /**
     * Buscar membro por ID
     * GET /api/v1/ekklesia/members/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Member> findById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.findById(id));
    }
    
    /**
     * Criar novo membro
     * POST /api/v1/ekklesia/members
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
    public ResponseEntity<Member> create(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.create(member));
    }
    
    /**
     * Atualizar membro existente
     * PUT /api/v1/ekklesia/members/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
    public ResponseEntity<Member> update(@PathVariable Long id, @RequestBody Member member) {
        return ResponseEntity.ok(memberService.update(id, member));
    }
    
    /**
     * Deletar membro (soft delete)
     * DELETE /api/v1/ekklesia/members/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Buscar membros com filtros avançados
     * GET /api/v1/ekklesia/members/filters?status=ACTIVE&spiritualStatus=MATURE&cellGroupId=1
     */
    @GetMapping("/filters")
    public ResponseEntity<Page<Member>> findByFilters(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String spiritualStatus,
        @RequestParam(required = false) Long cellGroupId,
        @RequestParam(required = false) Long ministryId,
        @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(memberService.findByFilters(status, spiritualStatus, cellGroupId, ministryId, pageable));
    }
    
    /**
     * Estatísticas de membros
     * GET /api/v1/ekklesia/members/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<StatsDto> getStats() {
        Long activeCount = memberService.countActiveMembers();
        return ResponseEntity.ok(new StatsDto(activeCount));
    }

    /**
     * Importar membros via Excel (.xlsx)
     */
    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
    public ResponseEntity<ImportResultDto> importMembers(@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(memberService.importFromExcel(file));
    }

    /**
     * Exportar membros para Excel (.xlsx)
     */
    @GetMapping(value = "/export", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
    public ResponseEntity<byte[]> exportMembers() {
        return memberService.exportToExcel();
    }
    
    // DTO para estatísticas
    public record StatsDto(Long activeMembers) {}

    // DTO para retorno de importação
    public record ImportResultDto(int imported, int skipped, String message) {}
}

