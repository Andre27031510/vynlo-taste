package com.vynlotaste.mapper;

import com.vynlotaste.dto.FinancialRequestDto;
import com.vynlotaste.dto.FinancialResponseDto;
import com.vynlotaste.entity.Financial;
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
public interface FinancialMapper {
    
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", expression = "java(financial.getUser() != null ? financial.getUser().getFullName() : null)")
    FinancialResponseDto toResponseDto(Financial financial);
    
    List<FinancialResponseDto> toResponseDtoList(List<Financial> financials);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", defaultValue = "PENDING")
    Financial toEntity(FinancialRequestDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromDto(FinancialRequestDto dto, @MappingTarget Financial financial);
    
    @AfterMapping
    default void setUserFromDto(FinancialRequestDto dto, @MappingTarget Financial financial, @Context User user) {
        if (user != null) {
            financial.setUser(user);
        }
    }
}