package com.vynlotaste.service;

import com.vynlotaste.entity.Delivery;
import com.vynlotaste.entity.Driver;
import com.vynlotaste.entity.Order;
import com.vynlotaste.repository.DeliveryRepository;
import com.vynlotaste.repository.DriverRepository;
import com.vynlotaste.repository.OrderRepository;
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
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;
    private final OrderRepository orderRepository;

    @Transactional
    @CacheEvict(value = "deliveryStats", allEntries = true)
    public Delivery createDelivery(Long orderId, String customerName, String customerPhone, 
                                   String deliveryAddress, Delivery.DeliverySource source) {
        try {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
            
            Delivery delivery = new Delivery();
            delivery.setOrder(order);
            delivery.setCustomerName(customerName);
            delivery.setCustomerPhone(customerPhone);
            delivery.setDeliveryAddress(deliveryAddress);
            delivery.setSource(source);
            delivery.setStatus(Delivery.DeliveryStatus.PREPARING);
            
            // MULTI-TENANCY: Setar tenant_id automaticamente
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            delivery.setTenantId(tenantId);
            log.debug("🔒 Delivery será criado com tenant_id={}", tenantId);
            
            Delivery saved = deliveryRepository.save(delivery);
            log.info("Delivery created: {} for order: {}", saved.getId(), orderId);
            return saved;
        } catch (Exception e) {
            log.error("Error creating delivery for order: {}", orderId, e);
            throw e;
        }
    }

    @Transactional
    @CacheEvict(value = "deliveryStats", allEntries = true)
    public Delivery updateDeliveryStatus(Long deliveryId, Delivery.DeliveryStatus newStatus, String notes) {
        try {
            Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + deliveryId));
            
            delivery.setStatus(newStatus);
            if (notes != null && !notes.trim().isEmpty()) {
                delivery.setNotes(notes);
            }
            
            Delivery updated = deliveryRepository.save(delivery);
            log.info("Delivery status updated: {} to {}", deliveryId, newStatus);
            return updated;
        } catch (Exception e) {
            log.error("Error updating delivery status: {}", deliveryId, e);
            throw e;
        }
    }

    @Transactional
    @CacheEvict(value = "deliveryStats", allEntries = true)
    public Delivery assignDriver(Long deliveryId, Long driverId) {
        try {
            Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + deliveryId));
            
            Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + driverId));
            
            delivery.setDriver(driver);
            delivery.setStatus(Delivery.DeliveryStatus.IN_TRANSIT);
            
            Delivery updated = deliveryRepository.save(delivery);
            log.info("Driver {} assigned to delivery: {}", driverId, deliveryId);
            return updated;
        } catch (Exception e) {
            log.error("Error assigning driver to delivery: {}", deliveryId, e);
            throw e;
        }
    }

    public Page<Delivery> getDeliveries(Delivery.DeliveryStatus status, String search, int page, int limit) {
        try {
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
            
            if (search != null && !search.trim().isEmpty()) {
                return deliveryRepository.searchDeliveries(search, pageable);
            }
            
            if (status != null) {
                return deliveryRepository.findByStatus(status, pageable);
            }
            
            return deliveryRepository.findAll(pageable);
        } catch (Exception e) {
            log.error("Error fetching deliveries", e);
            return Page.empty();
        }
    }

    public Delivery getDeliveryById(Long id) {
        return deliveryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + id));
    }

    @Cacheable(value = "deliveryStats", key = "'stats:' + (#root.target.getCurrentTenantId() ?: 'super')", unless = "#root.target.getCurrentTenantId() == null || #result == null")
    public Map<String, Object> getDeliveryStats() {
        try {
            long total = deliveryRepository.count();
            long inTransit = deliveryRepository.countByStatus(Delivery.DeliveryStatus.IN_TRANSIT);
            long preparing = deliveryRepository.countByStatus(Delivery.DeliveryStatus.PREPARING);
            long delivered = deliveryRepository.countByStatus(Delivery.DeliveryStatus.DELIVERED);
            long problems = deliveryRepository.countByStatus(Delivery.DeliveryStatus.PROBLEM);
            
            return Map.of(
                "totalDeliveries", total,
                "inTransit", inTransit,
                "preparing", preparing,
                "delivered", delivered,
                "problems", problems
            );
        } catch (Exception e) {
            log.error("Error fetching delivery stats", e);
            return Map.of(
                "totalDeliveries", 0,
                "inTransit", 0,
                "preparing", 0,
                "delivered", 0,
                "problems", 0
            );
        }
    }

    public List<Delivery> getRecentDeliveries(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return deliveryRepository.findRecentDeliveries(since);
    }
    
    /**
     * Método helper para cache - retorna tenant_id atual
     * Usado em @Cacheable key com SpEL: #root.target.getCurrentTenantId()
     */
    public Long getCurrentTenantId() {
        return com.vynlotaste.context.TenantContext.getCurrentTenantId();
    }
}

