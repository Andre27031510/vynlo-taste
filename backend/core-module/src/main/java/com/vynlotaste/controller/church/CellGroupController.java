package com.vynlotaste.controller.church;
// touch: redeploy note (commit 112b089, d96f8ca, ce2d2e6, 0cc13bc) - comentário leve sem impacto funcional

import com.vynlotaste.entity.church.CellGroup;
import com.vynlotaste.service.church.CellGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para CellGroup - EKKLESIA
 * Fase 1: Rota corrigida - removido /api do @RequestMapping (context-path=/api)
 * Rota final: /api/v1/ekklesia/cell-groups
 */
@RestController
@RequestMapping("/v1/ekklesia/cell-groups")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class CellGroupController {

	private final CellGroupService cellGroupService;

	@GetMapping
	public ResponseEntity<Page<CellGroup>> findAll(@PageableDefault(size = 10) Pageable pageable) {
		return ResponseEntity.ok(cellGroupService.findAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<CellGroup> findById(@PathVariable Long id) {
		return ResponseEntity.ok(cellGroupService.findById(id));
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<CellGroup> create(@RequestBody CellGroup cellGroup) {
		return ResponseEntity.ok(cellGroupService.create(cellGroup));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<CellGroup> update(@PathVariable Long id, @RequestBody CellGroup cellGroup) {
		return ResponseEntity.ok(cellGroupService.update(id, cellGroup));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		cellGroupService.delete(id);
		return ResponseEntity.noContent().build();
	}
}


