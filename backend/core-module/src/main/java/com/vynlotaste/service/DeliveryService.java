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
            // ✅ CORREÇÃO CRÍTICA: Buscar tenant_id ANTES de buscar order
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            log.info("🔒 Buscando order_id={} com tenant_id={}", orderId, tenantId);
            
            // ✅ CORREÇÃO: Buscar order SEM filtro de tenant (findById é global)
            // O order já foi criado com o tenant correto, apenas precisamos dele
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.error("❌ Order não encontrado: orderId={}, tenantId={}", orderId, tenantId);
                    return new IllegalArgumentException("Order not found: " + orderId);
                });
            
            log.info("✅ Order encontrado: id={}, tenant_id={}, customer={}", 
                order.getId(), order.getTenantId(), order.getCustomer().getFullName());
            
            Delivery delivery = new Delivery();
            delivery.setOrder(order);
            delivery.setCustomerName(customerName);
            delivery.setCustomerPhone(customerPhone);
            delivery.setDeliveryAddress(deliveryAddress);
            delivery.setSource(source);
            delivery.setStatus(Delivery.DeliveryStatus.PREPARING);
            
            // MULTI-TENANCY: Setar tenant_id automaticamente
            delivery.setTenantId(tenantId);
            log.info("🔒 Delivery será criado com tenant_id={}", tenantId);
            
            Delivery saved = deliveryRepository.save(delivery);
            log.info("✅ Delivery criado com sucesso: id={} para order: {}", saved.getId(), orderId);
            return saved;
        } catch (Exception e) {
            log.error("❌ Erro ao criar delivery para order: {}", orderId, e);
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
            // ✅ CORREÇÃO CRÍTICA: Buscar tenant_id do contexto
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            log.debug("🔒 Buscando deliveries para tenant_id={}, page={}, limit={}", tenantId, page, limit);
            
            // ✅ CORREÇÃO CRÍTICA: Paginação 0-indexed (Spring Data espera 0-based)
            // Frontend envia page=1 (primeira página), backend precisa de page=0
            int pageZero = Math.max(0, page - 1);
            Pageable pageable = PageRequest.of(pageZero, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
            
            log.debug("🔒 Pageable: page={}, size={}", pageZero, limit);
            
            // ✅ CORREÇÃO: Usar métodos com filtro de tenant
            if (status != null) {
                return deliveryRepository.findByStatusAndTenantId(status, tenantId, pageable);
            }
            
            return deliveryRepository.findAllByTenantId(tenantId, pageable);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar deliveries: page={}, limit={}", page, limit, e);
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
            // ✅ CORREÇÃO CRÍTICA: Filtrar stats por tenant_id
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            log.debug("🔒 Buscando stats de delivery para tenant_id={}", tenantId);
            
            long total = deliveryRepository.countByTenantId(tenantId);
            long inTransit = deliveryRepository.countByStatusAndTenantId(Delivery.DeliveryStatus.IN_TRANSIT, tenantId);
            long preparing = deliveryRepository.countByStatusAndTenantId(Delivery.DeliveryStatus.PREPARING, tenantId);
            long delivered = deliveryRepository.countByStatusAndTenantId(Delivery.DeliveryStatus.DELIVERED, tenantId);
            long problems = deliveryRepository.countByStatusAndTenantId(Delivery.DeliveryStatus.PROBLEM, tenantId);
            
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

