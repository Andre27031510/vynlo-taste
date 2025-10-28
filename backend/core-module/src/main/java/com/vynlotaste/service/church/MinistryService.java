package com.vynlotaste.service.church;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.church.Ministry;
import com.vynlotaste.repository.church.MinistryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MinistryService {

	private final MinistryRepository ministryRepository;

	@Transactional(readOnly = true)
	public Page<Ministry> findAll(Pageable pageable) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) return ministryRepository.findAll(pageable);
		if (tenantId == null) return Page.empty(pageable);
		return ministryRepository.findAllByTenantId(tenantId, pageable);
	}

	@Transactional(readOnly = true)
	public Ministry findById(Long id) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) return ministryRepository.findById(id).orElseThrow();
		if (tenantId == null) throw new RuntimeException("Tenant não definido");
		return ministryRepository.findByIdAndTenantId(id, tenantId).orElseThrow();
	}

	public Ministry create(Ministry ministry) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (tenantId == null && !TenantContext.isSuperAdmin()) throw new RuntimeException("Tenant não definido");
		ministry.setTenantId(tenantId);
		return ministryRepository.save(ministry);
	}

	public Ministry update(Long id, Ministry data) {
		Ministry existing = findById(id);
		existing.setName(data.getName());
		existing.setDescription(data.getDescription());
		existing.setLeaderId(data.getLeaderId());
		existing.setStatus(data.getStatus());
		return ministryRepository.save(existing);
	}

	public void delete(Long id) {
		Ministry existing = findById(id);
		existing.setStatus("INACTIVE");
		ministryRepository.save(existing);
	}
}


