package com.vynlotaste.service.church;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.church.CellGroup;
import com.vynlotaste.repository.church.CellGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CellGroupService {

	private final CellGroupRepository cellGroupRepository;

	@Transactional(readOnly = true)
	public Page<CellGroup> findAll(Pageable pageable) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) {
			return cellGroupRepository.findAll(pageable);
		}
		if (tenantId == null) return Page.empty(pageable);
		return cellGroupRepository.findAllByTenantId(tenantId, pageable);
	}

	@Transactional(readOnly = true)
	public CellGroup findById(Long id) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (TenantContext.isSuperAdmin()) {
			return cellGroupRepository.findById(id).orElseThrow();
		}
		if (tenantId == null) throw new RuntimeException("Tenant não definido");
		return cellGroupRepository.findByIdAndTenantId(id, tenantId).orElseThrow();
	}

	public CellGroup create(CellGroup cellGroup) {
		Long tenantId = TenantContext.getCurrentTenantId();
		if (tenantId == null && !TenantContext.isSuperAdmin()) throw new RuntimeException("Tenant não definido");
		cellGroup.setTenantId(tenantId);
		return cellGroupRepository.save(cellGroup);
	}

	public CellGroup update(Long id, CellGroup data) {
		CellGroup existing = findById(id);
		existing.setName(data.getName());
		existing.setLeaderId(data.getLeaderId());
		existing.setLocation(data.getLocation());
		existing.setDayOfWeek(data.getDayOfWeek());
		existing.setTime(data.getTime());
		existing.setStatus(data.getStatus());
		return cellGroupRepository.save(existing);
	}

	public void delete(Long id) {
		CellGroup existing = findById(id);
		existing.setStatus("INACTIVE");
		cellGroupRepository.save(existing);
	}
}


