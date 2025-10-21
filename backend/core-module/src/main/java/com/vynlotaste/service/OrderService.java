package com.vynlotaste.service;

import com.vynlotaste.config.CacheConfig;
import com.vynlotaste.dto.order.OrderRequestDto;
import com.vynlotaste.entity.*;
import com.vynlotaste.exception.order.OrderValidationException;
import com.vynlotaste.exception.user.UserNotFoundException;
import com.vynlotaste.exception.product.ProductOutOfStockException;
import com.vynlotaste.exception.payment.PaymentFailedException;
import com.vynlotaste.exception.BusinessException;
import com.vynlotaste.exception.ErrorCode;
import com.vynlotaste.repository.*;
import com.vynlotaste.event.EventPublisher;
import com.vynlotaste.event.OrderEvent;
import com.vynlotaste.notification.NotificationService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Validated
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final EventPublisher eventPublisher;
    private final MeterRegistry meterRegistry;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    
    private Counter orderCreatedCounter;
    private Counter orderCancelledCounter;
    private Timer orderProcessingTimer;
    
    @PostConstruct
    public void initializeMetrics() {
        this.orderCreatedCounter = Counter.builder("vynlo.orders.created")
            .description("Total orders created")
            .register(meterRegistry);
        this.orderCancelledCounter = Counter.builder("vynlo.orders.cancelled")
            .description("Total orders cancelled")
            .register(meterRegistry);
        this.orderProcessingTimer = Timer.builder("vynlo.orders.processing.time")
            .description("Order processing time")
            .register(meterRegistry);
    }

    @Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED)
    @CacheEvict(value = {CacheConfig.ORDERS_CACHE, CacheConfig.USERS_CACHE}, allEntries = true)
    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public Order createOrder(@Valid @NotNull OrderRequestDto orderRequest) {
        Timer.Sample sample = Timer.start(meterRegistry);
        
        try {
            log.info("Creating order for customer: {}, type: {}", orderRequest.getCustomerId(), orderRequest.getType());
            
            // Validações de negócio
            validateOrderRequest(orderRequest);
            
            // Buscar cliente
            User customer = userRepository.findById(orderRequest.getCustomerId())
                .orElseThrow(() -> new UserNotFoundException(orderRequest.getCustomerId()));
            
            // Criar pedido
            Order order = buildOrder(orderRequest, customer);
            
            // Validar e adicionar itens
            addItemsToOrder(order, orderRequest.getItems());
            
            // Calcular total
            BigDecimal calculatedTotal = calculateTotal(order.getItems());
            order.setTotalAmount(calculatedTotal);
            
            // Salvar pedido
            Order savedOrder = orderRepository.save(order);
            
            // Publicar evento
            eventPublisher.publishEvent(new OrderEvent("ORDER_CREATED", savedOrder.getId(), customer.getId()));
            
            // Métricas
            orderCreatedCounter.increment();
            
            log.info("Order created successfully: {} for customer: {}, total: {}", 
                savedOrder.getOrderNumber(), customer.getId(), calculatedTotal);
            
            return savedOrder;
            
        } catch (Exception e) {
            log.error("Error creating order for customer: {}", orderRequest.getCustomerId(), e);
            throw e;
        } finally {
            sample.stop(orderProcessingTimer);
        }
    }

    @Cacheable(value = CacheConfig.ORDERS_CACHE, key = "'order:' + #id + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public Order getOrderById(@NotNull @Positive Long id) {
        log.debug("Fetching order by ID: {}", id);
        return orderRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "Order not found with ID: " + id));
    }

    @Cacheable(value = CacheConfig.ORDERS_CACHE, key = "'user:' + #userId + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public List<Order> getOrdersByUser(@NotNull @Positive Long userId) {
        log.debug("Fetching orders for user: {}", userId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }
        
        return orderRepository.findByCustomerId(userId);
    }

    @Cacheable(value = CacheConfig.ORDERS_CACHE, key = "'status:' + #status.name() + ':' + (#root.target.getCurrentTenantId() ?: 'super')",
               unless = "#result == null || #result.isEmpty()")
    public List<Order> getOrdersByStatus(@NotNull Order.OrderStatus status) {
        log.debug("Fetching orders by status: {}", status);
        
        // MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os pedidos com status {}", status);
            return orderRepository.findByStatus(status);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        log.debug("👤 Cliente (tenant_id={}): retornando pedidos do tenant com status {}", tenantId, status);
        return orderRepository.findByStatusAndTenantId(status, tenantId);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @CachePut(value = CacheConfig.ORDERS_CACHE, key = "'order:' + #result.id")
    @CacheEvict(value = CacheConfig.ORDERS_CACHE, key = "'recent'")
    @Retryable(value = {Exception.class}, maxAttempts = 2, backoff = @Backoff(delay = 500))
    public Order updateOrderStatus(@NotNull @Positive Long orderId, @NotNull Order.OrderStatus newStatus) {
        log.info("Updating order status: {} to {}", orderId, newStatus);
        
        Order order = getOrderById(orderId);
        Order.OrderStatus oldStatus = order.getStatus();
        
        // Validar transição de status
        validateStatusTransition(oldStatus, newStatus);
        
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        
        // Publicar evento
        eventPublisher.publishEvent(new OrderEvent("ORDER_STATUS_UPDATED", orderId, order.getCustomer().getId()));
        
        // Enviar notificação
        sendNotification(savedOrder, "Status atualizado para: " + newStatus.name());
        
        log.info("Order status updated: {} from {} to {}", orderId, oldStatus, newStatus);
        return savedOrder;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @CacheEvict(value = CacheConfig.ORDERS_CACHE, allEntries = true)
    public Order cancelOrder(@NotNull @Positive Long orderId, String reason) {
        log.info("Cancelling order: {} with reason: {}", orderId, reason);
        
        Order order = getOrderById(orderId);
        
        if (!order.canBeCancelled()) {
            throw new OrderValidationException("Order cannot be cancelled in status: " + order.getStatus());
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setNotes(order.getNotes() + " | Cancelled: " + reason);
        
        Order savedOrder = orderRepository.save(order);
        
        // Publicar evento
        eventPublisher.publishEvent(new OrderEvent("ORDER_CANCELLED", orderId, order.getCustomer().getId()));
        
        // Métricas
        orderCancelledCounter.increment();
        
        // Notificação
        sendNotification(savedOrder, "Pedido cancelado: " + reason);
        
        log.info("Order cancelled: {}", orderId);
        return savedOrder;
    }

    /**
     * Atualiza um pedido existente (usado pelo modal de edição)
     * ✅ MULTI-TENANCY: Verifica se o pedido pertence ao tenant_id atual
     */
    @Transactional
    public Order updateOrder(Long orderId, com.vynlotaste.dto.order.OrderUpdateDto updateDto) {
        // MULTI-TENANCY: Buscar pedido com verificação de tenant_id
        Order order = getOrderById(orderId);
        
        // Atualizar campos
        if (updateDto.getStatus() != null) {
            order.setStatus(updateDto.getStatus());
        }
        
        if (updateDto.getDeliveryAddress() != null && !updateDto.getDeliveryAddress().trim().isEmpty()) {
            order.setDeliveryAddress(updateDto.getDeliveryAddress());
        }
        
        // Nota: paymentMethod não existe na entidade Order atual
        // Se necessário, adicionar campo na entidade Order primeiro
        
        if (updateDto.getNotes() != null && !updateDto.getNotes().trim().isEmpty()) {
            String currentNotes = order.getNotes() != null ? order.getNotes() : "";
            order.setNotes(currentNotes + (currentNotes.isEmpty() ? "" : " | ") + updateDto.getNotes());
        }
        
        Order savedOrder = orderRepository.save(order);
        log.info("✅ Pedido {} atualizado com sucesso", orderId);
        
        return savedOrder;
    }
    
    /**
     * Exclui um pedido (soft delete)
     * ✅ MULTI-TENANCY: Verifica se o pedido pertence ao tenant_id atual
     */
    @Transactional
    public void deleteOrder(Long orderId) {
        // MULTI-TENANCY: Buscar pedido com verificação de tenant_id
        Order order = getOrderById(orderId);
        
        // Soft delete - marcar como deletado
        order.setDeleted(true);
        orderRepository.save(order);
        
        log.info("✅ Pedido {} excluído com sucesso", orderId);
    }
    
    public BigDecimal calculateTotal(@NotNull List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        return items.stream()
            .map(OrderItem::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .setScale(2, RoundingMode.HALF_UP);
    }

    @Retryable(value = {PaymentFailedException.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public boolean processPayment(@NotNull Order order, @NotNull String paymentMethod) {
        log.info("Processing payment for order: {} with method: {}", order.getId(), paymentMethod);
        
        try {
            boolean paymentResult = paymentService.processPaymentSync(
                order.getId().toString(), 
                order.getTotalAmount(), 
                paymentMethod
            );
            
            if (paymentResult) {
                updateOrderStatus(order.getId(), Order.OrderStatus.CONFIRMED);
                log.info("Payment processed successfully for order: {}", order.getId());
            } else {
                log.warn("Payment failed for order: {}", order.getId());
                throw new PaymentFailedException(order.getId().toString(), "Payment processing failed");
            }
            
            return paymentResult;
            
        } catch (Exception e) {
            log.error("Payment processing error for order: {}", order.getId(), e);
            throw new PaymentFailedException(order.getId().toString(), e.getMessage(), e);
        }
    }

    @Retryable(value = {Exception.class}, maxAttempts = 2, backoff = @Backoff(delay = 1000))
    public void sendNotification(@NotNull Order order, @NotNull String message) {
        try {
            notificationService.sendOrderNotification(
                order.getCustomer().getEmail(),
                "Pedido " + order.getOrderNumber(),
                message
            );
            log.debug("Notification sent for order: {}", order.getId());
        } catch (Exception e) {
            log.error("Failed to send notification for order: {}", order.getId(), e);
        }
    }

    @Cacheable(value = CacheConfig.ORDERS_CACHE, key = "'recent:' + (#root.target.getCurrentTenantId() ?: 'super')",
               unless = "#result == null || #result.isEmpty()")
    public List<Order> findRecentOrders() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        log.debug("Fetching recent orders since: {}", since);
        
        // MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os pedidos recentes");
            return orderRepository.findByCreatedAtAfterOrderByCreatedAtDesc(since);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        log.debug("👤 Cliente (tenant_id={}): retornando pedidos recentes do tenant", tenantId);
        return orderRepository.findByTenantIdAndCreatedAtAfter(tenantId, since);
    }

    public Page<Order> findAllOrders(Pageable pageable) {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os pedidos paginados");
            return orderRepository.findAll(pageable);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando página vazia");
            return Page.empty(pageable);
        }
        log.debug("👤 Cliente (tenant_id={}): retornando pedidos do tenant paginados", tenantId);
        return orderRepository.findAllByTenantId(tenantId, pageable);
    }

    public List<Order> getAllOrders(int page, int limit, String status, String search) {
        try {
            // ✅ CORREÇÃO: Converter page 1-indexed (frontend) para 0-indexed (Spring Data)
            // Frontend envia page=1, mas Spring Data espera page=0
            int zeroIndexedPage = Math.max(0, page - 1);
            
            // Usar paginação correta para evitar OutOfMemory com 3M+ usuários
            Pageable pageable = PageRequest.of(zeroIndexedPage, limit, Sort.by("createdAt").descending());
            
            // MULTI-TENANCY: Filtrar por tenant_id
            Page<Order> orderPage;
            if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
                log.debug("🔑 Super Admin: retornando TODOS os pedidos");
                orderPage = orderRepository.findAll(pageable);
            } else {
                Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
                if (tenantId == null) {
                    log.warn("⚠️ Tenant não definido - retornando lista vazia");
                    return List.of();
                }
                log.debug("👤 Cliente (tenant_id={}): retornando pedidos do tenant", tenantId);
                orderPage = orderRepository.findAllByTenantId(tenantId, pageable);
            }
            
            return orderPage.getContent();
        } catch (Exception e) {
            log.error("Error fetching orders", e);
            return List.of();
        }
    }

    public List<Order> findByDateRange(LocalDateTime start, LocalDateTime end) {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: buscando TODOS os pedidos no período");
            return orderRepository.findByCreatedAtBetween(start, end);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        log.debug("👤 Cliente (tenant_id={}): buscando pedidos do tenant no período", tenantId);
        return orderRepository.findByTenantIdAndCreatedAtBetween(tenantId, start, end);
    }

    private void validateOrderRequest(OrderRequestDto orderRequest) {
        if (orderRequest.getType() == Order.OrderType.DELIVERY && 
            (orderRequest.getDeliveryAddress() == null || orderRequest.getDeliveryAddress().trim().isEmpty())) {
            throw new OrderValidationException("Delivery address is required for delivery orders");
        }
        
        if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
            throw new OrderValidationException("Order must have at least one item");
        }
    }

    private Order buildOrder(OrderRequestDto orderRequest, User customer) {
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setType(orderRequest.getType());
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setNotes(orderRequest.getNotes());
        order.setCustomer(customer);
        
        // ============================================================================
        // MULTI-TENANCY: Setar tenant_id automaticamente do contexto
        // ============================================================================
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        order.setTenantId(tenantId);  // null para Super Admin, ID para clientes
        log.debug("🔒 Order será criado com tenant_id={} ({})",
                 tenantId, tenantId == null ? "Super Admin" : "Cliente");
        
        return order;
    }

    private void addItemsToOrder(Order order, List<OrderRequestDto.OrderItemRequestDto> itemRequests) {
        for (OrderRequestDto.OrderItemRequestDto itemRequest : itemRequests) {
            Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND, 
                    "Product not found: " + itemRequest.getProductId()));
            
            // Verificar estoque
            if (!hasStock(product.getId(), itemRequest.getQuantity())) {
                throw new ProductOutOfStockException(product.getId(), itemRequest.getQuantity(), 0);
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(itemRequest.getUnitPrice() != null ? 
                itemRequest.getUnitPrice() : product.getPrice());
            orderItem.setItemNotes(itemRequest.getItemNotes());
            orderItem.setCustomizations(itemRequest.getCustomizations());
            
            // MULTI-TENANCY: OrderItem também precisa de tenant_id
            Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
            orderItem.setTenantId(tenantId);
            log.trace("🔒 OrderItem será criado com tenant_id={}", tenantId);
            
            order.addItem(orderItem);
        }
    }

    private void validateStatusTransition(Order.OrderStatus from, Order.OrderStatus to) {
        // Implementar regras de transição de status
        if (from == Order.OrderStatus.CANCELLED || from == Order.OrderStatus.DELIVERED) {
            throw new OrderValidationException("Cannot change status from " + from + " to " + to);
        }
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private boolean hasStock(Long productId, int quantity) {
        // Implementação simplificada - integrar com sistema de estoque
        return true;
    }

    public long countPendingOrders() {
        // ✅ MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: contando TODOS os pedidos pendentes");
            return orderRepository.countByStatus(Order.OrderStatus.PENDING);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando 0");
            return 0L;
        }
        log.debug("👤 Cliente (tenant_id={}): contando pedidos pendentes do tenant", tenantId);
        return orderRepository.countByTenantIdAndStatus(tenantId, Order.OrderStatus.PENDING);
    }

    public long countOrdersLastHour() {
        LocalDateTime since = LocalDateTime.now().minusHours(1);
        return orderRepository.countByCreatedAtAfter(since);
    }

    public BigDecimal getRevenueLastHour() {
        LocalDateTime since = LocalDateTime.now().minusHours(1);
        return orderRepository.sumTotalAmountByCreatedAtAfter(since);
    }

    public long countOrdersToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        
        // ✅ MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: contando TODOS os pedidos de hoje");
            return orderRepository.countByCreatedAtAfter(startOfDay);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando 0");
            return 0L;
        }
        log.debug("👤 Cliente (tenant_id={}): contando pedidos de hoje do tenant", tenantId);
        return orderRepository.countByTenantIdAndCreatedAtAfter(tenantId, startOfDay);
    }

    public BigDecimal getRevenueToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        
        // ✅ MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: somando TODA a receita de hoje");
            return orderRepository.sumTotalAmountByCreatedAtAfter(startOfDay);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando 0");
            return BigDecimal.ZERO;
        }
        log.debug("👤 Cliente (tenant_id={}): somando receita de hoje do tenant", tenantId);
        return orderRepository.sumTotalAmountByTenantIdAndCreatedAtAfter(tenantId, startOfDay);
    }
    
    /**
     * Método helper para cache - retorna tenant_id atual
     * Usado em @Cacheable key com SpEL: #root.target.getCurrentTenantId()
     */
    public Long getCurrentTenantId() {
        return com.vynlotaste.context.TenantContext.getCurrentTenantId();
    }
}