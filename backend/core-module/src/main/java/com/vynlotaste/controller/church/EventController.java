package com.vynlotaste.controller.church;

import com.vynlotaste.entity.church.Event;
import com.vynlotaste.service.church.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ekklesia/events")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class EventController {

	private final EventService eventService;

	@GetMapping
	public ResponseEntity<Page<Event>> findAll(@PageableDefault(size = 10) Pageable pageable) {
		return ResponseEntity.ok(eventService.findAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<Event> findById(@PathVariable Long id) {
		return ResponseEntity.ok(eventService.findById(id));
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Event> create(@RequestBody Event event) {
		return ResponseEntity.ok(eventService.create(event));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Event> update(@PathVariable Long id, @RequestBody Event event) {
		return ResponseEntity.ok(eventService.update(id, event));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_MEMBERS')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		eventService.delete(id);
		return ResponseEntity.noContent().build();
	}
}


