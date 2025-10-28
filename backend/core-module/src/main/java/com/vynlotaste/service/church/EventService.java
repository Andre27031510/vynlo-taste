package com.vynlotaste.service.church;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.church.Event;
import com.vynlotaste.repository.church.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

	private final EventRepository eventRepository;

	@Transactional(readOnly = true)
	public Page<Event> findAll(Pageable pageable) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) return eventRepository.findAll(pageable);
		if (tenantId == null) return Page.empty(pageable);
		return eventRepository.findAllByTenantId(tenantId, pageable);
	}

	@Transactional(readOnly = true)
	public Event findById(Long id) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) return eventRepository.findById(id).orElseThrow();
		if (tenantId == null) throw new RuntimeException("Tenant não definido");
		return eventRepository.findByIdAndTenantId(id, tenantId).orElseThrow();
	}

	public Event create(Event event) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (tenantId == null && !TenantContext.isSuperAdmin()) throw new RuntimeException("Tenant não definido");
		event.setTenantId(tenantId);
		return eventRepository.save(event);
	}

	public Event update(Long id, Event data) {
		Event existing = findById(id);
		existing.setTitle(data.getTitle());
		existing.setDescription(data.getDescription());
		existing.setEventType(data.getEventType());
		existing.setCategory(data.getCategory());
		existing.setStartDate(data.getStartDate());
		existing.setEndDate(data.getEndDate());
		existing.setLocation(data.getLocation());
		existing.setOrganizerId(data.getOrganizerId());
		existing.setExpectedAttendance(data.getExpectedAttendance());
		existing.setActualAttendance(data.getActualAttendance());
		existing.setStatus(data.getStatus());
		return eventRepository.save(existing);
	}

	public void delete(Long id) {
		Event existing = findById(id);
		existing.setStatus("CANCELLED");
		eventRepository.save(existing);
	}
}


