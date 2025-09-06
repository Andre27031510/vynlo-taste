package com.vynlotaste.mapper;

import com.vynlotaste.dto.product.ProductRequestDto;
import com.vynlotaste.dto.product.ProductResponseDto;
import com.vynlotaste.entity.Product;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    unmappedTargetPolicy = ReportingPolicy.WARN,
    uses = {DateTimeMapper.class}
)
@Component
public interface ProductMapper {
    
    ProductResponseDto toResponseDto(Product product);
    
    List<ProductResponseDto> toResponseDtoList(List<Product> products);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", constant = "false")
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "available", constant = "true")
    @Mapping(target = "stockQuantity", constant = "0")
    Product toEntity(ProductRequestDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntityFromDto(ProductRequestDto dto, @MappingTarget Product product);
    
    default String getStockStatus(Product product) {
        if (product == null || product.getStockQuantity() == null) {
            return "SEM_INFORMACAO";
        }
        int stock = product.getStockQuantity();
        if (stock == 0) return "SEM_ESTOQUE";
        else if (stock <= 5) return "ESTOQUE_BAIXO";
        else if (stock <= 20) return "ESTOQUE_MEDIO";
        else return "EM_ESTOQUE";
    }
    
    default String formatPrice(BigDecimal price) {
        if (price == null) return "Preço não informado";
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
        return formatter.format(price);
    }
}