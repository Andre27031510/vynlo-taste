package com.vynlotaste.service.church;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.church.Tithing;
import com.vynlotaste.repository.church.TithingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TithingService {

	private final TithingRepository tithingRepository;

	@Transactional(readOnly = true)
	public Page<Tithing> findAll(Pageable pageable) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) return tithingRepository.findAll(pageable);
		if (tenantId == null) return Page.empty(pageable);
		return tithingRepository.findAllByTenantId(tenantId, pageable);
	}

	@Transactional(readOnly = true)
	public Tithing findById(Long id) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) return tithingRepository.findById(id).orElseThrow();
		if (tenantId == null) throw new RuntimeException("Tenant não definido");
		return tithingRepository.findByIdAndTenantId(id, tenantId).orElseThrow();
	}

	public Tithing create(Tithing tithing) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (tenantId == null && !TenantContext.isSuperAdmin()) throw new RuntimeException("Tenant não definido");
		tithing.setTenantId(tenantId);
		return tithingRepository.save(tithing);
	}

	public Tithing update(Long id, Tithing data) {
		Tithing existing = findById(id);
		existing.setMemberId(data.getMemberId());
		existing.setAmount(data.getAmount());
		existing.setTitheType(data.getTitheType());
		existing.setPaymentMethod(data.getPaymentMethod());
		existing.setPaymentDate(data.getPaymentDate());
		existing.setReferenceNumber(data.getReferenceNumber());
		existing.setNotes(data.getNotes());
		return tithingRepository.save(existing);
	}

	public void delete(Long id) {
		Tithing existing = findById(id);
		existing.setDeletedAt(java.time.LocalDateTime.now());
		tithingRepository.save(existing);
	}
}


