package com.vynlotaste.mapper;

import com.vynlotaste.dto.delivery.DeliveryResponseDto;
import com.vynlotaste.entity.Delivery;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para Delivery entity → DeliveryResponseDto
 * v2.1.3 - Adicionado mapeamento completo de campos do Order
 * Fix: Informações do pedido não apareciam na lista de delivery
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface DeliveryMapper {
    
    @Mapping(target = "orderId", expression = "java(delivery.getOrder() != null ? delivery.getOrder().getId() : null)")
    @Mapping(target = "driverId", expression = "java(delivery.getDriver() != null ? delivery.getDriver().getId() : null)")
    @Mapping(target = "driverName", expression = "java(delivery.getDriver() != null ? delivery.getDriver().getName() : null)")
    @Mapping(target = "driverPhone", expression = "java(delivery.getDriver() != null ? delivery.getDriver().getPhone() : null)")
    @Mapping(target = "driverVehicle", expression = "java(getDriverVehicleInfo(delivery))")
    // ✅ CORREÇÃO: Mapear campos para compatibilidade com frontend
    @Mapping(target = "customer", expression = "java(delivery.getCustomerName())")
    @Mapping(target = "address", expression = "java(delivery.getDeliveryAddress())")
    @Mapping(target = "phone", expression = "java(delivery.getCustomerPhone())")
    @Mapping(target = "driver", expression = "java(delivery.getDriver() != null ? delivery.getDriver().getName() : null)")
    @Mapping(target = "total", expression = "java(getOrderTotal(delivery))")
    @Mapping(target = "items", expression = "java(getOrderItems(delivery))")
    DeliveryResponseDto toResponseDto(Delivery delivery);
    
    // Helper para concatenar informações do veículo
    default String getDriverVehicleInfo(Delivery delivery) {
        if (delivery.getDriver() != null) {
            return delivery.getDriver().getVehicle() + " - " + delivery.getDriver().getPlate();
        }
        return null;
    }
    
    // ✅ CORREÇÃO: Helper para obter total do pedido
    default BigDecimal getOrderTotal(Delivery delivery) {
        if (delivery.getOrder() != null && delivery.getOrder().getTotalAmount() != null) {
            return delivery.getOrder().getTotalAmount();
        }
        return BigDecimal.ZERO;
    }
    
    // ✅ CORREÇÃO: Helper para obter itens do pedido
    default List<String> getOrderItems(Delivery delivery) {
        if (delivery.getOrder() != null && delivery.getOrder().getItems() != null) {
            return delivery.getOrder().getItems().stream()
                .map(item -> item.getQuantity() + "x " + item.getProduct().getName())
                .collect(Collectors.toList());
        }
        return List.of();
    }
}

