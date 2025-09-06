package com.vynlotaste.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ProductProjection {
    
    Long getId();
    String getName();
    String getDescription();
    BigDecimal getPrice();
    String getCategory();
    Boolean getAvailable();
    Integer getStockQuantity();
    LocalDateTime getCreatedAt();
}

// Projeção para catálogo público (sem informações sensíveis)
interface ProductCatalogProjection {
    Long getId();
    String getName();
    String getDescription();
    BigDecimal getPrice();
    String getCategory();
    Boolean getAvailable();
    String getImageUrl();
    Integer getPreparationTime();
    Boolean getVegan();
    Boolean getVegetarian();
    Boolean getGlutenFree();
}

// Projeção para listagem simples
interface ProductSummaryProjection {
    Long getId();
    String getName();
    BigDecimal getPrice();
    String getCategory();
    Boolean getAvailable();
    Integer getStockQuantity();
}