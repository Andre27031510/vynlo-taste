package com.vynlotaste.controller.church;

import com.vynlotaste.entity.church.Ministry;
import com.vynlotaste.service.church.MinistryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ekklesia/ministries")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class MinistryController {

	private final MinistryService ministryService;

	@GetMapping
	public ResponseEntity<Page<Ministry>> findAll(@PageableDefault(size = 10) Pageable pageable) {
		return ResponseEntity.ok(ministryService.findAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<Ministry> findById(@PathVariable Long id) {
		return ResponseEntity.ok(ministryService.findById(id));
	}

	@GetMapping("/church/{churchId}")
	public ResponseEntity<List<Ministry>> findByChurchId(@PathVariable Long churchId) {
		return ResponseEntity.ok(ministryService.findByChurchId(churchId));
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Ministry> create(@RequestBody Ministry ministry) {
		return ResponseEntity.ok(ministryService.create(ministry));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Ministry> update(@PathVariable Long id, @RequestBody Ministry ministry) {
		return ResponseEntity.ok(ministryService.update(id, ministry));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		ministryService.delete(id);
		return ResponseEntity.noContent().build();
	}
}


