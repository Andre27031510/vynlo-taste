package com.vynlotaste.dto.product;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Schema(description = "Dados de resposta do produto")
public class ProductResponseDto {
    
    @Schema(description = "ID único do produto", example = "1")
    private Long id;
    
    @Schema(description = "Nome do produto", example = "Pizza Margherita")
    private String name;
    
    @Schema(description = "Descrição do produto", example = "Pizza tradicional italiana com molho de tomate, mussarela e manjericão fresco")
    private String description;
    
    @Schema(description = "Preço do produto", example = "29.90")
    private BigDecimal price;
    
    @Schema(description = "URL da imagem do produto", example = "https://exemplo.com/pizza-margherita.jpg")
    private String imageUrl;
    
    @Schema(description = "Produto disponível", example = "true")
    private Boolean available;
    
    @Schema(description = "Tempo de preparo em minutos", example = "30")
    private Integer preparationTime;
    
    @Schema(description = "Quantidade em estoque", example = "50")
    private Integer stockQuantity;
    
    @Schema(description = "Categoria do produto", example = "Pizzas")
    private String category;
    
    @Schema(description = "Lista de ingredientes", example = "Massa de pizza, molho de tomate, mussarela, manjericão")
    private String ingredients;
    
    @Schema(description = "Peso em quilogramas", example = "0.85")
    private BigDecimal weight;
    
    @Schema(description = "Valor calórico por porção", example = "320")
    private Integer calories;
    
    @Schema(description = "Produto vegano", example = "false")
    private Boolean vegan;
    
    @Schema(description = "Produto vegetariano", example = "true")
    private Boolean vegetarian;
    
    @Schema(description = "Produto sem glúten", example = "false")
    private Boolean glutenFree;
    
    @Schema(description = "Data de criação", example = "2024-01-01T10:00:00Z")
    private LocalDateTime createdAt;
    
    @Schema(description = "Data de atualização", example = "2024-01-01T10:00:00Z")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Status de estoque calculado", example = "EM_ESTOQUE")
    private String stockStatus;
    
    @Schema(description = "Preço formatado", example = "R$ 29,90")
    private String formattedPrice;
}