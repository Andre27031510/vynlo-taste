package com.vynlotaste.repository.church;

import com.vynlotaste.entity.church.Ministry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MinistryRepository extends JpaRepository<Ministry, Long> {
    Page<Ministry> findAllByTenantId(Long tenantId, Pageable pageable);
    Page<Ministry> findByTenantIdAndStatus(Long tenantId, String status, Pageable pageable);
    Optional<Ministry> findByIdAndTenantId(Long id, Long tenantId);
    List<Ministry> findAllByTenantIdAndStatusAndDeletedAtIsNull(Long tenantId, String status);
    List<Ministry> findByChurchIdAndDeletedAtIsNull(Long churchId);
    List<Ministry> findAllByTenantIdAndChurchId(Long tenantId, Long churchId);
}

