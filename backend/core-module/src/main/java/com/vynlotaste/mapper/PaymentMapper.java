package com.vynlotaste.mapper;

import com.vynlotaste.dto.PaymentRequestDto;
import com.vynlotaste.dto.PaymentResponseDto;
import com.vynlotaste.entity.Order;
import com.vynlotaste.entity.Payment;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {DateTimeMapper.class}
)
@Component
public interface PaymentMapper {
    
    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "orderNumber", expression = "java(payment.getOrder() != null ? payment.getOrder().getOrderNumber() : null)")
    PaymentResponseDto toResponseDto(Payment payment);
    
    List<PaymentResponseDto> toResponseDtoList(List<Payment> payments);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "status", defaultValue = "PENDING")
    Payment toEntity(PaymentRequestDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "order", ignore = true)
    void updateEntityFromDto(PaymentRequestDto dto, @MappingTarget Payment payment);
    
    @AfterMapping
    default void setOrderFromDto(PaymentRequestDto dto, @MappingTarget Payment payment, @Context Order order) {
        if (order != null) {
            payment.setOrder(order);
        }
    }
}