package com.vynlotaste.controller.church;
// touch: redeploy note (commit 2ee3526) - comentário leve sem impacto funcional - atualizado para forçar push

import com.vynlotaste.entity.church.Tithing;
import com.vynlotaste.service.church.TithingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para Tithing - EKKLESIA
 * Fase 1: Rota corrigida - removido /api do @RequestMapping (context-path=/api)
 * Rota final: /api/v1/ekklesia/tithings
 */
@RestController
@RequestMapping("/v1/ekklesia/tithings")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class TithingController {

	private final TithingService tithingService;

	@GetMapping
	public ResponseEntity<Page<Tithing>> findAll(@PageableDefault(size = 10) Pageable pageable) {
		return ResponseEntity.ok(tithingService.findAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<Tithing> findById(@PathVariable Long id) {
		return ResponseEntity.ok(tithingService.findById(id));
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Tithing> create(@RequestBody Tithing tithing) {
		return ResponseEntity.ok(tithingService.create(tithing));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Tithing> update(@PathVariable Long id, @RequestBody Tithing tithing) {
		return ResponseEntity.ok(tithingService.update(id, tithing));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		tithingService.delete(id);
		return ResponseEntity.noContent().build();
	}
}


