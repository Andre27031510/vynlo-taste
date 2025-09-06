package com.vynlotaste.fixtures;

import com.vynlotaste.dto.user.UserRequestDto;
import com.vynlotaste.dto.user.UserResponseDto;
import com.vynlotaste.dto.product.ProductRequestDto;
import com.vynlotaste.dto.product.ProductResponseDto;
import com.vynlotaste.dto.order.OrderRequestDto;
import com.vynlotaste.entity.User;
import com.vynlotaste.entity.UserRole;
import com.vynlotaste.entity.Product;
import com.vynlotaste.entity.Order;
import com.vynlotaste.entity.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class TestDataFixtures {

    // User Fixtures
    public static User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setFirstName("João");
        user.setLastName("Silva");
        user.setPhone("(11) 99999-9999");
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    public static UserRequestDto createUserRequestDto() {
        UserRequestDto dto = new UserRequestDto();
        dto.setEmail("test@example.com");
        dto.setUsername("testuser");
        dto.setFirstName("João");
        dto.setLastName("Silva");
        dto.setPhone("(11) 99999-9999");
        dto.setRole(UserRole.CUSTOMER);
        dto.setActive(true);
        return dto;
    }

    public static UserResponseDto createUserResponseDto() {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(1L);
        dto.setEmail("test@example.com");
        dto.setUsername("testuser");
        dto.setFirstName("João");
        dto.setLastName("Silva");
        dto.setFullName("João Silva");
        dto.setPhone("(11) 99999-9999");
        dto.setRole(UserRole.CUSTOMER);
        dto.setActive(true);
        dto.setEmailVerified(true);
        dto.setCreatedAt(LocalDateTime.now());
        return dto;
    }

    // Product Fixtures
    public static Product createTestProduct() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Pizza Margherita");
        product.setDescription("Pizza tradicional italiana");
        product.setPrice(new BigDecimal("29.90"));
        product.setAvailable(true);
        product.setStockQuantity(10);
        product.setCategory("Pizzas");
        product.setPreparationTime(30);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return product;
    }

    public static ProductRequestDto createProductRequestDto() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Pizza Margherita");
        dto.setDescription("Pizza tradicional italiana");
        dto.setPrice(new BigDecimal("29.90"));
        dto.setAvailable(true);
        dto.setStockQuantity(10);
        dto.setCategory("Pizzas");
        dto.setPreparationTime(30);
        return dto;
    }

    public static ProductResponseDto createProductResponseDto() {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(1L);
        dto.setName("Pizza Margherita");
        dto.setDescription("Pizza tradicional italiana");
        dto.setPrice(new BigDecimal("29.90"));
        dto.setAvailable(true);
        dto.setStockQuantity(10);
        dto.setCategory("Pizzas");
        dto.setPreparationTime(30);
        dto.setCreatedAt(LocalDateTime.now());
        return dto;
    }

    // Order Fixtures
    public static Order createTestOrder() {
        Order order = new Order();
        order.setId(1L);
        order.setOrderNumber("ORD-123456");
        order.setStatus(Order.OrderStatus.PENDING);
        order.setType(Order.OrderType.DELIVERY);
        order.setTotalAmount(new BigDecimal("59.80"));
        order.setDeliveryAddress("Rua Teste, 123");
        order.setCustomer(createTestUser());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return order;
    }

    public static OrderRequestDto createOrderRequestDto() {
        OrderRequestDto dto = new OrderRequestDto();
        dto.setType(Order.OrderType.DELIVERY);
        dto.setDeliveryAddress("Rua Teste, 123");
        dto.setCustomerId(1L);
        dto.setItems(List.of(createOrderItemRequestDto()));
        return dto;
    }

    public static OrderRequestDto.OrderItemRequestDto createOrderItemRequestDto() {
        OrderRequestDto.OrderItemRequestDto dto = new OrderRequestDto.OrderItemRequestDto();
        dto.setProductId(1L);
        dto.setQuantity(2);
        dto.setUnitPrice(new BigDecimal("29.90"));
        return dto;
    }

    public static OrderItem createTestOrderItem() {
        OrderItem item = new OrderItem();
        item.setId(1L);
        item.setProduct(createTestProduct());
        item.setQuantity(2);
        item.setUnitPrice(new BigDecimal("29.90"));
        item.setCreatedAt(LocalDateTime.now());
        return item;
    }

    // Admin User
    public static User createAdminUser() {
        User admin = createTestUser();
        admin.setId(2L);
        admin.setEmail("admin@example.com");
        admin.setUsername("admin");
        admin.setRole(UserRole.ADMIN);
        return admin;
    }

    // Invalid Data
    public static UserRequestDto createInvalidUserRequestDto() {
        UserRequestDto dto = new UserRequestDto();
        dto.setEmail("invalid-email");
        dto.setFirstName("");
        dto.setLastName("");
        return dto;
    }

    public static ProductRequestDto createInvalidProductRequestDto() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("");
        dto.setPrice(new BigDecimal("-10.00"));
        dto.setStockQuantity(-5);
        return dto;
    }
}