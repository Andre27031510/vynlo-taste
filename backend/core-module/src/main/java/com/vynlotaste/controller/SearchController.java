package com.vynlotaste.controller;

import com.vynlotaste.entity.Order;
import com.vynlotaste.entity.Product;
import com.vynlotaste.entity.User;
import com.vynlotaste.entity.UserRole;
import com.vynlotaste.service.DynamicQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Dynamic Search", description = "Advanced search with dynamic filters")
public class SearchController {

    private final DynamicQueryService dynamicQueryService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Search users with dynamic filters")
    public ResponseEntity<Page<User>> searchUsers(
            @Parameter(description = "User role filter") @RequestParam(required = false) UserRole role,
            @Parameter(description = "Active status filter") @RequestParam(required = false) Boolean active,
            @Parameter(description = "Email verified filter") @RequestParam(required = false) Boolean emailVerified,
            @Parameter(description = "Created after date") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAfter,
            @Parameter(description = "Created before date") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdBefore,
            @Parameter(description = "Email contains") @RequestParam(required = false) String emailContains,
            @Parameter(description = "Name contains") @RequestParam(required = false) String nameContains,
            @Parameter(description = "Phone contains") @RequestParam(required = false) String phone,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDirection) {

        Page<User> users = dynamicQueryService.findUsers(
            role, active, emailVerified, createdAfter, createdBefore,
            emailContains, nameContains, phone, page, size, sortBy, sortDirection
        );

        return ResponseEntity.ok(users);
    }

    @GetMapping("/products")
    @Operation(summary = "Search products with dynamic filters")
    public ResponseEntity<Page<Product>> searchProducts(
            @Parameter(description = "Category filter") @RequestParam(required = false) String category,
            @Parameter(description = "Available filter") @RequestParam(required = false) Boolean available,
            @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Name contains") @RequestParam(required = false) String nameContains,
            @Parameter(description = "Description contains") @RequestParam(required = false) String descriptionContains,
            @Parameter(description = "Minimum stock") @RequestParam(required = false) Integer minStock,
            @Parameter(description = "Vegan filter") @RequestParam(required = false) Boolean vegan,
            @Parameter(description = "Vegetarian filter") @RequestParam(required = false) Boolean vegetarian,
            @Parameter(description = "Gluten free filter") @RequestParam(required = false) Boolean glutenFree,
            @Parameter(description = "Ingredient contains") @RequestParam(required = false) String ingredientContains,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String sortDirection) {

        Page<Product> products = dynamicQueryService.findProducts(
            category, available, minPrice, maxPrice, nameContains, descriptionContains,
            minStock, vegan, vegetarian, glutenFree, ingredientContains,
            page, size, sortBy, sortDirection
        );

        return ResponseEntity.ok(products);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    @Operation(summary = "Search orders with dynamic filters")
    public ResponseEntity<Page<Order>> searchOrders(
            @Parameter(description = "Order status filter") @RequestParam(required = false) Order.OrderStatus status,
            @Parameter(description = "Order type filter") @RequestParam(required = false) Order.OrderType type,
            @Parameter(description = "Customer ID filter") @RequestParam(required = false) Long customerId,
            @Parameter(description = "Customer email contains") @RequestParam(required = false) String customerEmail,
            @Parameter(description = "Created after date") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAfter,
            @Parameter(description = "Created before date") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdBefore,
            @Parameter(description = "Minimum amount") @RequestParam(required = false) BigDecimal minAmount,
            @Parameter(description = "Maximum amount") @RequestParam(required = false) BigDecimal maxAmount,
            @Parameter(description = "Order number contains") @RequestParam(required = false) String orderNumber,
            @Parameter(description = "Delivery address contains") @RequestParam(required = false) String deliveryAddress,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDirection) {

        Page<Order> orders = dynamicQueryService.findOrders(
            status, type, customerId, customerEmail, createdAfter, createdBefore,
            minAmount, maxAmount, orderNumber, deliveryAddress,
            page, size, sortBy, sortDirection
        );

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/products/category/{category}")
    @Operation(summary = "Get available products by category")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = dynamicQueryService.findAvailableProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/vegan")
    @Operation(summary = "Get vegan products")
    public ResponseEntity<List<Product>> getVeganProducts() {
        List<Product> products = dynamicQueryService.findVeganProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Get products with low stock")
    public ResponseEntity<List<Product>> getLowStockProducts(
            @Parameter(description = "Stock threshold") @RequestParam(defaultValue = "5") int threshold) {
        List<Product> products = dynamicQueryService.findLowStockProducts(threshold);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/orders/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    @Operation(summary = "Get pending orders")
    public ResponseEntity<List<Order>> getPendingOrders() {
        List<Order> orders = dynamicQueryService.findPendingOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/delivery")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('DRIVER')")
    @Operation(summary = "Get delivery orders")
    public ResponseEntity<List<Order>> getDeliveryOrders(
            @Parameter(description = "Order status filter") @RequestParam(required = false) Order.OrderStatus status) {
        List<Order> orders = dynamicQueryService.findDeliveryOrders(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/high-value")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Get high value orders")
    public ResponseEntity<List<Order>> getHighValueOrders(
            @Parameter(description = "Minimum amount") @RequestParam BigDecimal minAmount) {
        List<Order> orders = dynamicQueryService.findHighValueOrders(minAmount);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/users/recent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Get recent users")
    public ResponseEntity<List<User>> getRecentUsers(
            @Parameter(description = "Days back") @RequestParam(defaultValue = "7") int days) {
        List<User> users = dynamicQueryService.findRecentUsers(days);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/active-customers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Get active customers with recent orders")
    public ResponseEntity<List<User>> getActiveCustomersWithRecentOrders(
            @Parameter(description = "Days back") @RequestParam(defaultValue = "30") int days) {
        List<User> users = dynamicQueryService.findActiveCustomersWithRecentOrders(days);
        return ResponseEntity.ok(users);
    }
}