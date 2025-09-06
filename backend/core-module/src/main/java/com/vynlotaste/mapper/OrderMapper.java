package com.vynlotaste.mapper;

import com.vynlotaste.dto.order.OrderRequestDto;
import com.vynlotaste.dto.order.OrderResponseDto;
import com.vynlotaste.entity.Order;
import com.vynlotaste.entity.OrderItem;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    unmappedTargetPolicy = ReportingPolicy.WARN,
    uses = {UserMapper.class, DateTimeMapper.class}
)
@Component
public interface OrderMapper {
    
    OrderResponseDto toResponseDto(Order order);
    
    List<OrderResponseDto> toResponseDtoList(List<Order> orders);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderNumber", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", constant = "false")
    @Mapping(target = "version", ignore = true)
    Order toEntity(OrderRequestDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntityFromDto(OrderRequestDto dto, @MappingTarget Order order);
    
    OrderResponseDto.OrderItemResponseDto toOrderItemResponseDto(OrderItem orderItem);
    
    List<OrderResponseDto.OrderItemResponseDto> toOrderItemResponseDtoList(List<OrderItem> orderItems);
    
    default String getStatusDisplay(Order.OrderStatus status) {
        if (status == null) return "Desconhecido";
        
        return switch (status) {
            case PENDING -> "Pendente";
            case CONFIRMED -> "Confirmado";
            case PREPARING -> "Preparando";
            case READY -> "Pronto";
            case DELIVERED -> "Entregue";
            case CANCELLED -> "Cancelado";
        };
    }
    
    default Integer calculateRemainingTime(Order order) {
        if (order == null || order.getCreatedAt() == null) return null;
        
        LocalDateTime now = LocalDateTime.now();
        long minutesSinceCreation = ChronoUnit.MINUTES.between(order.getCreatedAt(), now);
        
        int estimatedTime = switch (order.getStatus()) {
            case PENDING -> 5;
            case CONFIRMED -> 30;
            case PREPARING -> 20;
            case READY -> 10;
            default -> 0;
        };
        
        int remaining = (int) (estimatedTime - minutesSinceCreation);
        return Math.max(0, remaining);
    }
    
    default Integer calculateProgress(Order.OrderStatus status) {
        if (status == null) return 0;
        
        return switch (status) {
            case PENDING -> 10;
            case CONFIRMED -> 25;
            case PREPARING -> 60;
            case READY -> 90;
            case DELIVERED -> 100;
            case CANCELLED -> 0;
        };
    }
    
    default BigDecimal calculateFinalAmount(Order order) {
        if (order == null || order.getTotalAmount() == null) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = order.getTotalAmount();
        
        // Adicionar taxa de entrega se houver
        // Subtrair desconto se houver
        
        return total;
    }
    
    @AfterMapping
    default void enrichOrderResponse(@MappingTarget OrderResponseDto dto, Order order) {
        if (order != null && dto != null) {
            if (dto.getStatusDisplay() == null) {
                dto.setStatusDisplay(getStatusDisplay(order.getStatus()));
            }
            if (dto.getProgressPercentage() == null) {
                dto.setProgressPercentage(calculateProgress(order.getStatus()));
            }
        }
    }
}