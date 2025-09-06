package com.vynlotaste.service;

import com.vynlotaste.entity.Order;
import com.vynlotaste.entity.Product;
import com.vynlotaste.entity.User;
import com.vynlotaste.entity.UserRole;
import com.vynlotaste.repository.OrderRepository;
import com.vynlotaste.repository.ProductRepository;
import com.vynlotaste.repository.UserRepository;
import com.vynlotaste.specification.OrderSpecifications;
import com.vynlotaste.specification.ProductSpecifications;
import com.vynlotaste.specification.UserSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DynamicQueryService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    // User queries
    @Cacheable(value = "userQueries", key = "#role + '_' + #active + '_' + #emailVerified")
    public Page<User> findUsers(UserRole role, Boolean active, Boolean emailVerified,
                               LocalDateTime createdAfter, LocalDateTime createdBefore,
                               String emailContains, String nameContains, String phone,
                               int page, int size, String sortBy, String sortDirection) {
        
        log.debug("Finding users with filters - role: {}, active: {}, page: {}", role, active, page);
        
        Specification<User> spec = UserSpecifications.buildDynamicQuery(
            role, active, emailVerified, createdAfter, createdBefore, 
            emailContains, nameContains, phone
        );
        
        Sort sort = createSort(sortBy, sortDirection);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return userRepository.findAll(spec, pageable);
    }

    public List<User> findActiveUsersByRole(UserRole role) {
        Specification<User> spec = Specification
            .where(UserSpecifications.hasRole(role))
            .and(UserSpecifications.isActive(true));
        
        return userRepository.findAll(spec);
    }

    public List<User> findRecentUsers(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        Specification<User> spec = UserSpecifications.createdAfter(since);
        
        return userRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // Product queries
    @Cacheable(value = "productQueries", key = "#category + '_' + #available + '_' + #minPrice + '_' + #maxPrice")
    public Page<Product> findProducts(String category, Boolean available, 
                                     BigDecimal minPrice, BigDecimal maxPrice,
                                     String nameContains, String descriptionContains,
                                     Integer minStock, Boolean vegan, Boolean vegetarian,
                                     Boolean glutenFree, String ingredientContains,
                                     int page, int size, String sortBy, String sortDirection) {
        
        log.debug("Finding products with filters - category: {}, available: {}, page: {}", category, available, page);
        
        Specification<Product> spec = ProductSpecifications.buildDynamicQuery(
            category, available, minPrice, maxPrice, nameContains, descriptionContains,
            minStock, vegan, vegetarian, glutenFree, ingredientContains
        );
        
        Sort sort = createSort(sortBy, sortDirection);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return productRepository.findAll(spec, pageable);
    }

    public List<Product> findAvailableProductsByCategory(String category) {
        Specification<Product> spec = Specification
            .where(ProductSpecifications.hasCategory(category))
            .and(ProductSpecifications.isAvailable(true))
            .and(ProductSpecifications.isInStock());
        
        return productRepository.findAll(spec, Sort.by("name"));
    }

    public List<Product> findProductsInPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        Specification<Product> spec = Specification
            .where(ProductSpecifications.priceBetween(minPrice, maxPrice))
            .and(ProductSpecifications.isAvailable(true));
        
        return productRepository.findAll(spec, Sort.by("price"));
    }

    public List<Product> findVeganProducts() {
        Specification<Product> spec = Specification
            .where(ProductSpecifications.isVegan(true))
            .and(ProductSpecifications.isAvailable(true));
        
        return productRepository.findAll(spec);
    }

    public List<Product> findLowStockProducts(int threshold) {
        Specification<Product> spec = Specification
            .where(ProductSpecifications.stockLessThan(threshold))
            .and(ProductSpecifications.isAvailable(true));
        
        return productRepository.findAll(spec, Sort.by("stockQuantity"));
    }

    // Order queries
    @Cacheable(value = "orderQueries", key = "#status + '_' + #type + '_' + #customerId + '_' + #createdAfter")
    public Page<Order> findOrders(Order.OrderStatus status, Order.OrderType type,
                                 Long customerId, String customerEmail,
                                 LocalDateTime createdAfter, LocalDateTime createdBefore,
                                 BigDecimal minAmount, BigDecimal maxAmount,
                                 String orderNumber, String deliveryAddress,
                                 int page, int size, String sortBy, String sortDirection) {
        
        log.debug("Finding orders with filters - status: {}, type: {}, page: {}", status, type, page);
        
        Specification<Order> spec = OrderSpecifications.buildDynamicQuery(
            status, type, customerId, customerEmail, createdAfter, createdBefore,
            minAmount, maxAmount, orderNumber, deliveryAddress
        );
        
        Sort sort = createSort(sortBy, sortDirection);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return orderRepository.findAll(spec, pageable);
    }

    public List<Order> findOrdersByCustomer(Long customerId, Order.OrderStatus status) {
        Specification<Order> spec = Specification
            .where(OrderSpecifications.hasCustomerId(customerId));
        
        if (status != null) {
            spec = spec.and(OrderSpecifications.hasStatus(status));
        }
        
        return orderRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<Order> findOrdersInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        Specification<Order> spec = OrderSpecifications.createdBetween(startDate, endDate);
        
        return orderRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<Order> findPendingOrders() {
        Specification<Order> spec = OrderSpecifications.isPendingOrConfirmed();
        
        return orderRepository.findAll(spec, Sort.by("createdAt"));
    }

    public List<Order> findDeliveryOrders(Order.OrderStatus status) {
        Specification<Order> spec = Specification
            .where(OrderSpecifications.isDeliveryType());
        
        if (status != null) {
            spec = spec.and(OrderSpecifications.hasStatus(status));
        }
        
        return orderRepository.findAll(spec, Sort.by("createdAt"));
    }

    public List<Order> findHighValueOrders(BigDecimal minAmount) {
        Specification<Order> spec = OrderSpecifications.totalAmountGreaterThan(minAmount);
        
        return orderRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "totalAmount"));
    }

    // Complex combined queries
    public List<User> findActiveCustomersWithRecentOrders(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        
        // Buscar usuários ativos que são clientes
        Specification<User> userSpec = Specification
            .where(UserSpecifications.hasRole(UserRole.CUSTOMER))
            .and(UserSpecifications.isActive(true));
        
        List<User> activeCustomers = userRepository.findAll(userSpec);
        
        // Filtrar apenas aqueles com pedidos recentes
        return activeCustomers.stream()
            .filter(user -> {
                Specification<Order> orderSpec = Specification
                    .where(OrderSpecifications.hasCustomerId(user.getId()))
                    .and(OrderSpecifications.createdAfter(since));
                
                return orderRepository.count(orderSpec) > 0;
            })
            .toList();
    }

    public List<Product> findPopularProducts(int days, int minOrders) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        
        // Esta seria uma query mais complexa que requereria JOIN com OrderItem
        // Por simplicidade, retornando produtos disponíveis ordenados por nome
        Specification<Product> spec = ProductSpecifications.isAvailable(true);
        
        return productRepository.findAll(spec, Sort.by("name"));
    }

    // Utility methods
    private Sort createSort(String sortBy, String sortDirection) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        
        return Sort.by(direction, sortBy);
    }

    // Count methods for statistics
    public long countUsers(UserRole role, Boolean active) {
        Specification<User> spec = Specification
            .where(UserSpecifications.hasRole(role))
            .and(UserSpecifications.isActive(active));
        
        return userRepository.count(spec);
    }

    public long countProducts(String category, Boolean available) {
        Specification<Product> spec = Specification
            .where(ProductSpecifications.hasCategory(category))
            .and(ProductSpecifications.isAvailable(available));
        
        return productRepository.count(spec);
    }

    public long countOrders(Order.OrderStatus status, LocalDateTime since) {
        Specification<Order> spec = Specification
            .where(OrderSpecifications.hasStatus(status))
            .and(OrderSpecifications.createdAfter(since));
        
        return orderRepository.count(spec);
    }
}