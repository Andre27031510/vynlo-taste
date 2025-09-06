package com.vynlotaste.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    
    // User errors (1000-1999)
    USER_NOT_FOUND("VT-1001", "User not found"),
    USER_ALREADY_EXISTS("VT-1002", "User already exists"),
    USER_INACTIVE("VT-1003", "User is inactive"),
    INVALID_CREDENTIALS("VT-1004", "Invalid credentials"),
    
    // Product errors (2000-2999)
    PRODUCT_NOT_FOUND("VT-2001", "Product not found"),
    PRODUCT_OUT_OF_STOCK("VT-2002", "Product out of stock"),
    PRODUCT_UNAVAILABLE("VT-2003", "Product unavailable"),
    INSUFFICIENT_STOCK("VT-2004", "Insufficient stock"),
    
    // Order errors (3000-3999)
    ORDER_NOT_FOUND("VT-3001", "Order not found"),
    ORDER_VALIDATION_ERROR("VT-3002", "Order validation failed"),
    ORDER_CANNOT_BE_CANCELLED("VT-3003", "Order cannot be cancelled"),
    INVALID_ORDER_STATUS("VT-3004", "Invalid order status"),
    
    // Payment errors (4000-4999)
    PAYMENT_FAILED("VT-4001", "Payment processing failed"),
    PAYMENT_DECLINED("VT-4002", "Payment declined"),
    INVALID_PAYMENT_METHOD("VT-4003", "Invalid payment method"),
    
    // System errors (5000-5999)
    INTERNAL_SERVER_ERROR("VT-5001", "Internal server error"),
    SERVICE_UNAVAILABLE("VT-5002", "Service temporarily unavailable"),
    DATABASE_ERROR("VT-5003", "Database operation failed"),
    EXTERNAL_SERVICE_ERROR("VT-5004", "External service error"),
    
    // Validation errors (6000-6999)
    VALIDATION_ERROR("VT-6001", "Validation failed"),
    INVALID_INPUT("VT-6002", "Invalid input provided"),
    MISSING_REQUIRED_FIELD("VT-6003", "Required field missing"),
    
    // Security errors (7000-7999)
    UNAUTHORIZED("VT-7001", "Unauthorized access"),
    FORBIDDEN("VT-7002", "Access forbidden"),
    INSUFFICIENT_PERMISSIONS("VT-7003", "Insufficient permissions"),
    TOKEN_EXPIRED("VT-7004", "Token expired"),
    INVALID_TOKEN("VT-7005", "Invalid token"),
    
    // Rate limiting (8000-8999)
    RATE_LIMIT_EXCEEDED("VT-8001", "Rate limit exceeded"),
    TOO_MANY_REQUESTS("VT-8002", "Too many requests");
    
    private final String code;
    private final String defaultMessage;
}