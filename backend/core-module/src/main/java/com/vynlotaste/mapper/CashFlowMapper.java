package com.vynlotaste.mapper;

import com.vynlotaste.dto.CashFlowRequestDto;
import com.vynlotaste.dto.CashFlowResponseDto;
import com.vynlotaste.entity.CashFlow;
import com.vynlotaste.entity.User;
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
public interface CashFlowMapper {
    
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", expression = "java(cashFlow.getUser() != null ? cashFlow.getUser().getFullName() : null)")
    @Mapping(target = "signedAmount", expression = "java(cashFlow.getSignedAmount())")
    CashFlowResponseDto toResponseDto(CashFlow cashFlow);
    
    List<CashFlowResponseDto> toResponseDtoList(List<CashFlow> cashFlows);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", defaultValue = "PENDING")
    CashFlow toEntity(CashFlowRequestDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromDto(CashFlowRequestDto dto, @MappingTarget CashFlow cashFlow);
    
    @AfterMapping
    default void setUserFromDto(CashFlowRequestDto dto, @MappingTarget CashFlow cashFlow, @Context User user) {
        if (user != null) {
            cashFlow.setUser(user);
        }
    }
}