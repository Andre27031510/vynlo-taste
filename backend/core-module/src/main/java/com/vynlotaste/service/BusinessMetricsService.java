package com.vynlotaste.service;

import io.micrometer.core.instrument.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessMetricsService {

    private final MeterRegistry meterRegistry;
    private final UserService userService;
    private final OrderService orderService;
    private final ProductService productService;

    // Contadores de negócio - inicializados via @PostConstruct
    private Counter ordersCreated;
    private Counter ordersCompleted;
    private Counter ordersCancelled;
    private Counter usersRegistered;
    private Counter productsViewed;

    // Gauges para valores atuais
    private final AtomicLong activeUsers = new AtomicLong(0);
    private final AtomicLong pendingOrders = new AtomicLong(0);
    private final AtomicLong totalRevenue = new AtomicLong(0);

    // Timers para performance - inicializados via @PostConstruct
    private Timer orderProcessingTime;
    private Timer deliveryTime;

    @PostConstruct
    public void initializeMetrics() {
        // Inicializar contadores
        ordersCreated = Counter.builder("vynlo.business.orders.created")
            .description("Total orders created")
            .register(meterRegistry);
        
        ordersCompleted = Counter.builder("vynlo.business.orders.completed")
            .description("Total orders completed")
            .register(meterRegistry);
        
        ordersCancelled = Counter.builder("vynlo.business.orders.cancelled")
            .description("Total orders cancelled")
            .register(meterRegistry);
        
        usersRegistered = Counter.builder("vynlo.business.users.registered")
            .description("Total users registered")
            .register(meterRegistry);
        
        productsViewed = Counter.builder("vynlo.business.products.viewed")
            .description("Total product views")
            .register(meterRegistry);
        
        // Inicializar timers
        orderProcessingTime = Timer.builder("vynlo.business.order.processing.time")
            .description("Time to process an order")
            .register(meterRegistry);
        
        deliveryTime = Timer.builder("vynlo.business.delivery.time")
            .description("Time from order to delivery")
            .register(meterRegistry);
        
        // Registrar gauges
        Gauge.builder("vynlo.business.users.active", activeUsers, AtomicLong::doubleValue)
            .description("Number of active users")
            .register(meterRegistry);

        Gauge.builder("vynlo.business.orders.pending", pendingOrders, AtomicLong::doubleValue)
            .description("Number of pending orders")
            .register(meterRegistry);

        Gauge.builder("vynlo.business.revenue.total", totalRevenue, AtomicLong::doubleValue)
            .description("Total revenue in cents")
            .register(meterRegistry);
    }

    // Métodos para registrar eventos de negócio

    public void recordOrderCreated(String orderType, BigDecimal amount) {
        Counter.builder("vynlo.business.orders.created")
            .tag("type", orderType)
            .register(meterRegistry)
            .increment();
        
        DistributionSummary.builder("vynlo.business.order.amount")
            .description("Order amount distribution")
            .tag("type", orderType)
            .register(meterRegistry)
            .record(amount.doubleValue());

        log.debug("Order created: type={}, amount={}", orderType, amount);
    }

    public void recordOrderCompleted(String orderId, LocalDateTime createdAt, BigDecimal amount) {
        ordersCompleted.increment();
        
        // Calcular tempo de processamento
        long processingTimeMinutes = ChronoUnit.MINUTES.between(createdAt, LocalDateTime.now());
        orderProcessingTime.record(processingTimeMinutes, java.util.concurrent.TimeUnit.MINUTES);
        
        // Atualizar receita
        totalRevenue.addAndGet(amount.multiply(BigDecimal.valueOf(100)).longValue()); // em centavos
        
        log.info("Order completed: id={}, processingTime={}min, amount={}", 
            orderId, processingTimeMinutes, amount);
    }

    public void recordOrderCancelled(String reason) {
        Counter.builder("vynlo.business.orders.cancelled")
            .tag("reason", reason)
            .register(meterRegistry)
            .increment();
        log.info("Order cancelled: reason={}", reason);
    }

    public void recordUserRegistration(String source) {
        Counter.builder("vynlo.business.users.registered")
            .tag("source", source)
            .register(meterRegistry)
            .increment();
        log.info("User registered: source={}", source);
    }

    public void recordProductView(Long productId, String category) {
        Counter.builder("vynlo.business.products.viewed")
            .tag("category", category)
            .register(meterRegistry)
            .increment();
        
        Counter.builder("vynlo.business.product.views")
            .description("Product views by ID")
            .tag("product_id", productId.toString())
            .tag("category", category)
            .register(meterRegistry)
            .increment();
    }

    public void recordDeliveryCompleted(String orderId, LocalDateTime orderTime) {
        long deliveryTimeMinutes = ChronoUnit.MINUTES.between(orderTime, LocalDateTime.now());
        deliveryTime.record(deliveryTimeMinutes, java.util.concurrent.TimeUnit.MINUTES);
        
        log.info("Delivery completed: orderId={}, deliveryTime={}min", orderId, deliveryTimeMinutes);
    }

    public void recordCustomerSatisfaction(int rating, String orderId) {
        DistributionSummary.builder("vynlo.business.customer.satisfaction")
            .description("Customer satisfaction ratings")
            .tag("order_id", orderId)
            .register(meterRegistry)
            .record(rating);
        
        log.info("Customer satisfaction recorded: orderId={}, rating={}", orderId, rating);
    }

    // Métricas calculadas periodicamente
    @Scheduled(fixedRate = 60000) // A cada minuto
    public void updateActiveUsersMetric() {
        try {
            long count = userService.countActiveUsersLast24Hours();
            activeUsers.set(count);
            log.debug("Active users updated: {}", count);
        } catch (Exception e) {
            log.error("Error updating active users metric", e);
        }
    }

    @Scheduled(fixedRate = 30000) // A cada 30 segundos
    public void updatePendingOrdersMetric() {
        try {
            long count = orderService.countPendingOrders();
            pendingOrders.set(count);
            log.debug("Pending orders updated: {}", count);
        } catch (Exception e) {
            log.error("Error updating pending orders metric", e);
        }
    }

    @Scheduled(fixedRate = 300000) // A cada 5 minutos
    public void calculateConversionRate() {
        try {
            long totalViews = Math.round(productsViewed.count());
            long totalOrders = Math.round(ordersCreated.count());
            
            if (totalViews > 0) {
                double conversionRate = (double) totalOrders / totalViews * 100;
                
                final double rate = conversionRate;
                Gauge.builder("vynlo.business.conversion.rate", rate, Double::doubleValue)
                    .description("Conversion rate percentage")
                    .register(meterRegistry);
                
                log.info("Conversion rate calculated: {}%", String.format("%.2f", conversionRate));
            }
        } catch (Exception e) {
            log.error("Error calculating conversion rate", e);
        }
    }

    @Scheduled(cron = "0 0 * * * *") // A cada hora
    public void recordHourlyMetrics() {
        try {
            long ordersLastHour = orderService.countOrdersLastHour();
            BigDecimal revenueLastHour = orderService.getRevenueLastHour();
            
            Gauge.builder("vynlo.business.orders.hourly", ordersLastHour, Long::doubleValue)
                .description("Orders per hour")
                .register(meterRegistry);
            
            Gauge.builder("vynlo.business.revenue.hourly", revenueLastHour, bd -> bd.doubleValue())
                .description("Revenue per hour")
                .register(meterRegistry);
            
            log.info("Hourly metrics: orders={}, revenue={}", ordersLastHour, revenueLastHour);
        } catch (Exception e) {
            log.error("Error recording hourly metrics", e);
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // Diariamente à meia-noite
    public void recordDailyMetrics() {
        try {
            long ordersToday = orderService.countOrdersToday();
            BigDecimal revenueToday = orderService.getRevenueToday();
            long newUsersToday = userService.countNewUsersToday();
            
            Gauge.builder("vynlo.business.orders.daily", ordersToday, Long::doubleValue)
                .description("Orders per day")
                .register(meterRegistry);
            
            Gauge.builder("vynlo.business.revenue.daily", revenueToday, bd -> bd.doubleValue())
                .description("Revenue per day")
                .register(meterRegistry);
            
            Gauge.builder("vynlo.business.users.daily", newUsersToday, Long::doubleValue)
                .description("New users per day")
                .register(meterRegistry);
            
            log.info("Daily metrics: orders={}, revenue={}, newUsers={}", 
                ordersToday, revenueToday, newUsersToday);
        } catch (Exception e) {
            log.error("Error recording daily metrics", e);
        }
    }
}