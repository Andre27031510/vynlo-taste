package com.vynlotaste.dto.product;

import com.vynlotaste.dto.validation.ValidationGroups;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

@Data
@Schema(description = "Dados para criação/atualização de produto")
public class ProductRequestDto {
    
    @NotNull(message = "Nome não pode ser nulo", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @NotBlank(message = "Nome é obrigatório", groups = ValidationGroups.Create.class)
    @Length(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s0-9'.-]+$", message = "Nome contém caracteres inválidos")
    @Schema(description = "Nome do produto", example = "Pizza Margherita", required = true, minLength = 2, maxLength = 100)
    private String name;
    
    @Length(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s0-9,.!?'\"()-]+$", message = "Descrição contém caracteres inválidos")
    @Schema(description = "Descrição detalhada do produto", 
            example = "Pizza tradicional italiana com molho de tomate, mussarela e manjericão fresco",
            maxLength = 1000)
    private String description;
    
    @NotNull(message = "Preço é obrigatório", groups = ValidationGroups.Create.class)
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    @DecimalMax(value = "9999.99", message = "Preço deve ser menor que R$ 9.999,99")
    @Digits(integer = 4, fraction = 2, message = "Preço deve ter no máximo 4 dígitos inteiros e 2 decimais")
    @Schema(description = "Preço do produto em reais", example = "29.90", required = true, 
            minimum = "0.01", maximum = "9999.99")
    private BigDecimal price;
    
    @Length(max = 500, message = "URL da imagem deve ter no máximo 500 caracteres")
    @Pattern(regexp = "^(https?://)?[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/.*)?$", 
             message = "URL da imagem inválida")
    @Schema(description = "URL da imagem do produto", 
            example = "https://exemplo.com/pizza-margherita.jpg",
            maxLength = 500)
    private String imageUrl;
    
    @Schema(description = "Produto disponível para venda", example = "true", defaultValue = "true")
    private Boolean available;
    
    @Min(value = 1, message = "Tempo de preparo deve ser pelo menos 1 minuto")
    @Max(value = 480, message = "Tempo de preparo deve ser no máximo 8 horas (480 minutos)")
    @Schema(description = "Tempo de preparo em minutos", example = "30", 
            minimum = "1", maximum = "480")
    private Integer preparationTime;
    
    @Min(value = 0, message = "Quantidade em estoque não pode ser negativa")
    @Max(value = 99999, message = "Quantidade em estoque deve ser menor que 100.000")
    @Schema(description = "Quantidade disponível em estoque", example = "50", 
            minimum = "0", maximum = "99999", defaultValue = "0")
    private Integer stockQuantity;
    
    @Length(max = 100, message = "Categoria deve ter no máximo 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s]+$", message = "Categoria deve conter apenas letras e espaços")
    @Schema(description = "Categoria do produto", example = "Pizzas", maxLength = 100)
    private String category;
    
    @Length(max = 500, message = "Ingredientes devem ter no máximo 500 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s0-9,.-]+$", message = "Ingredientes contêm caracteres inválidos")
    @Schema(description = "Lista de ingredientes separados por vírgula", 
            example = "Massa de pizza, molho de tomate, mussarela, manjericão",
            maxLength = 500)
    private String ingredients;
    
    @DecimalMin(value = "0.0", message = "Peso não pode ser negativo")
    @DecimalMax(value = "99.99", message = "Peso deve ser menor que 100kg")
    @Digits(integer = 2, fraction = 2, message = "Peso deve ter no máximo 2 dígitos inteiros e 2 decimais")
    @Schema(description = "Peso do produto em quilogramas", example = "0.85", 
            minimum = "0.0", maximum = "99.99")
    private BigDecimal weight;
    
    @Min(value = 0, message = "Calorias não podem ser negativas")
    @Max(value = 9999, message = "Calorias devem ser menores que 10.000")
    @Schema(description = "Valor calórico por porção", example = "320", 
            minimum = "0", maximum = "9999")
    private Integer calories;
    
    @Schema(description = "Produto é vegano", example = "false", defaultValue = "false")
    private Boolean vegan;
    
    @Schema(description = "Produto é vegetariano", example = "true", defaultValue = "false")
    private Boolean vegetarian;
    
    @Schema(description = "Produto contém glúten", example = "true", defaultValue = "false")
    private Boolean glutenFree;
}