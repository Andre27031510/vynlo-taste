package com.vynlotaste.service;

import com.vynlotaste.entity.Driver;
import com.vynlotaste.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DriverService {

    private final DriverRepository driverRepository;

    @Transactional
    @CacheEvict(value = "driverStats", allEntries = true)
    public Driver createDriver(String name, String phone, String email, String vehicle, String plate) {
        try {
            // Validar duplicados
            if (driverRepository.existsByPhone(phone)) {
                throw new IllegalArgumentException("Driver with phone " + phone + " already exists");
            }
            
            if (email != null && driverRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Driver with email " + email + " already exists");
            }
            
            Driver driver = new Driver();
            driver.setName(name);
            driver.setPhone(phone);
            driver.setEmail(email);
            driver.setVehicle(vehicle);
            driver.setPlate(plate);
            driver.setStatus(Driver.DriverStatus.OFFLINE);
            driver.setRating(0.0);
            
            // MULTI-TENANCY: Setar tenant_id automaticamente
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            driver.setTenantId(tenantId);
            log.debug("🔒 Driver será criado com tenant_id={}", tenantId);
            driver.setTotalDeliveries(0);
            
            Driver saved = driverRepository.save(driver);
            log.info("Driver created: {} - {}", saved.getId(), saved.getName());
            return saved;
        } catch (Exception e) {
            log.error("Error creating driver", e);
            throw e;
        }
    }

    @Transactional
    @CacheEvict(value = "driverStats", allEntries = true)
    public Driver updateDriver(Long id, String name, String phone, String email, 
                              String vehicle, String plate, String address, 
                              String cpf, String cnh) {
        try {
            Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + id));
            
            if (name != null) driver.setName(name);
            if (phone != null) driver.setPhone(phone);
            if (email != null) driver.setEmail(email);
            if (vehicle != null) driver.setVehicle(vehicle);
            if (plate != null) driver.setPlate(plate);
            if (address != null) driver.setAddress(address);
            if (cpf != null) driver.setCpf(cpf);
            if (cnh != null) driver.setCnh(cnh);
            
            Driver updated = driverRepository.save(driver);
            log.info("Driver updated: {}", id);
            return updated;
        } catch (Exception e) {
            log.error("Error updating driver: {}", id, e);
            throw e;
        }
    }

    @Transactional
    @CacheEvict(value = "driverStats", allEntries = true)
    public Driver updateDriverStatus(Long id, Driver.DriverStatus newStatus) {
        try {
            Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + id));
            
            driver.setStatus(newStatus);
            if (newStatus != Driver.DriverStatus.OFFLINE) {
                driver.setLastActive(LocalDateTime.now());
            }
            
            Driver updated = driverRepository.save(driver);
            log.info("Driver status updated: {} to {}", id, newStatus);
            return updated;
        } catch (Exception e) {
            log.error("Error updating driver status: {}", id, e);
            throw e;
        }
    }

    @Transactional
    @CacheEvict(value = "driverStats", allEntries = true)
    public void deleteDriver(Long id) {
        try {
            if (!driverRepository.existsById(id)) {
                throw new IllegalArgumentException("Driver not found: " + id);
            }
            
            driverRepository.deleteById(id);
            log.info("Driver deleted: {}", id);
        } catch (Exception e) {
            log.error("Error deleting driver: {}", id, e);
            throw e;
        }
    }

    public Page<Driver> getDrivers(Driver.DriverStatus status, String search, int page, int limit) {
        try {
            Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.ASC, "name"));
            
            // MULTI-TENANCY: Filtrar por tenant_id
            if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
                log.debug("🔑 Super Admin: retornando TODOS os drivers");
                if (search != null && !search.trim().isEmpty()) {
                    return driverRepository.searchDrivers(search, pageable);
                }
                if (status != null) {
                    return driverRepository.findByStatus(status, pageable);
                }
                return driverRepository.findAll(pageable);
            }
            
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            if (tenantId == null) {
                log.warn("⚠️ Tenant não definido - retornando página vazia");
                return Page.empty();
            }
            
            log.debug("👤 Cliente (tenant_id={}): retornando drivers do tenant", tenantId);
            if (search != null && !search.trim().isEmpty()) {
                return driverRepository.searchDriversByTenantId(search, tenantId, pageable);
            }
            if (status != null) {
                return driverRepository.findByStatusAndTenantId(status, tenantId, pageable);
            }
            return driverRepository.findAllByTenantId(tenantId, pageable);
            
        } catch (Exception e) {
            log.error("Error fetching drivers", e);
            return Page.empty();
        }
        // Modified: 2025-10-14 21:30 UTC | CRITICAL FIX: PageRequest.of(page, limit) - 0-based pagination
        // Modified: 2025-10-18 | MULTI-TENANCY: Filtro por tenant_id adicionado
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + id));
    }

    @Cacheable(value = "driverStats", key = "'stats:' + (#root.target.getCurrentTenantId() ?: 'super')", unless = "#result == null")
    public Map<String, Object> getDriverStats() {
        try {
            long total = driverRepository.count();
            long available = driverRepository.countByStatus(Driver.DriverStatus.AVAILABLE);
            long busy = driverRepository.countByStatus(Driver.DriverStatus.BUSY);
            long offline = driverRepository.countByStatus(Driver.DriverStatus.OFFLINE);
            Double averageRating = driverRepository.getAverageRating();
            
            return Map.of(
                "totalDrivers", total,
                "available", available,
                "busy", busy,
                "offline", offline,
                "averageRating", averageRating != null ? averageRating : 0.0
            );
        } catch (Exception e) {
            log.error("Error fetching driver stats", e);
            return Map.of(
                "totalDrivers", 0,
                "available", 0,
                "busy", 0,
                "offline", 0,
                "averageRating", 0.0
            );
        }
    }
    
    /**
     * Método helper para cache - retorna tenant_id atual
     * Usado em @Cacheable key com SpEL: #root.target.getCurrentTenantId()
     */
    public Long getCurrentTenantId() {
        return com.vynlotaste.context.TenantContext.getCurrentTenantId();
    }
}

