package com.vynlotaste.mapper;

import com.vynlotaste.dto.delivery.DeliveryResponseDto;
import com.vynlotaste.entity.Delivery;
import com.vynlotaste.entity.Driver;
import com.vynlotaste.entity.Order;
import org.mapstruct.*;

/**
 * Mapper para Delivery entity → DeliveryResponseDto
 * v2.1.2 - Criado para evitar serialização de proxies Hibernate
 * Fix: HTTP 500 ao criar delivery (lazy loading Order e Customer)
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
    DeliveryResponseDto toResponseDto(Delivery delivery);
    
    // Helper para concatenar informações do veículo
    default String getDriverVehicleInfo(Delivery delivery) {
        if (delivery.getDriver() != null) {
            return delivery.getDriver().getVehicle() + " - " + delivery.getDriver().getPlate();
        }
        return null;
    }
}

