package com.vynlotaste.projection;

import com.vynlotaste.entity.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface OrderProjection {
    
    Long getId();
    String getOrderNumber();
    Order.OrderStatus getStatus();
    Order.OrderType getType();
    BigDecimal getTotalAmount();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    
    // Customer info
    CustomerInfo getCustomer();
    
    interface CustomerInfo {
        Long getId();
        String getEmail();
        String getFirstName();
        String getLastName();
    }
}

// Projeção para dashboard administrativo
interface OrderSummaryProjection {
    Long getId();
    String getOrderNumber();
    Order.OrderStatus getStatus();
    BigDecimal getTotalAmount();
    LocalDateTime getCreatedAt();
    String getCustomerEmail();
}

// Projeção para relatórios
interface OrderReportProjection {
    Long getId();
    String getOrderNumber();
    Order.OrderStatus getStatus();
    Order.OrderType getType();
    BigDecimal getTotalAmount();
    LocalDateTime getCreatedAt();
    String getCustomerEmail();
    String getCustomerName();
}