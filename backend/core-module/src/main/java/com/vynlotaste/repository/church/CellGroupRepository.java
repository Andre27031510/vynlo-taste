package com.vynlotaste.repository.church;

import com.vynlotaste.entity.church.CellGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CellGroupRepository extends JpaRepository<CellGroup, Long> {
    Page<CellGroup> findAllByTenantId(Long tenantId, Pageable pageable);
    Page<CellGroup> findByTenantIdAndStatus(Long tenantId, String status, Pageable pageable);
    Optional<CellGroup> findByIdAndTenantId(Long id, Long tenantId);
    List<CellGroup> findAllByTenantIdAndStatusAndDeletedAtIsNull(Long tenantId, String status);
}

