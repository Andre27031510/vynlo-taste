package com.vynlotaste.dto.order;

import com.vynlotaste.dto.validation.ValidationGroups;
import com.vynlotaste.entity.Order;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "Dados para criação/atualização de pedido")
public class OrderRequestDto {
    
    @NotNull(message = "Tipo do pedido é obrigatório", groups = ValidationGroups.Create.class)
    @Schema(description = "Tipo do pedido", example = "DELIVERY", required = true,
            allowableValues = {"DELIVERY", "PICKUP", "DINE_IN"})
    private Order.OrderType type;
    
    @Length(max = 200, message = "Endereço de entrega deve ter no máximo 200 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9À-ÿ\\u00C0-\\u017F\\s,.'-]+$", 
             message = "Endereço de entrega contém caracteres inválidos")
    @Schema(description = "Endereço de entrega (obrigatório para DELIVERY)", 
            example = "Rua das Flores, 123, Apt 45, Centro, São Paulo - SP",
            maxLength = 200)
    private String deliveryAddress;
    
    @Length(max = 500, message = "Observações devem ter no máximo 500 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s0-9,.!?'\"()-]+$", 
             message = "Observações contêm caracteres inválidos")
    @Schema(description = "Observações especiais do pedido", 
            example = "Sem cebola na pizza, entregar no portão dos fundos",
            maxLength = 500)
    private String notes;
    
    @NotNull(message = "ID do cliente é obrigatório", groups = ValidationGroups.Create.class)
    @Positive(message = "ID do cliente deve ser positivo")
    @Schema(description = "ID do cliente que fez o pedido", example = "1", required = true)
    private Long customerId;
    
    @NotNull(message = "Itens do pedido são obrigatórios", groups = ValidationGroups.Create.class)
    @NotEmpty(message = "Pedido deve ter pelo menos um item")
    @Size(max = 50, message = "Pedido pode ter no máximo 50 itens")
    @Valid
    @Schema(description = "Lista de itens do pedido", required = true)
    private List<OrderItemRequestDto> items;
    
    @DecimalMin(value = "0.00", message = "Valor total não pode ser negativo")
    @DecimalMax(value = "99999.99", message = "Valor total deve ser menor que R$ 99.999,99")
    @Digits(integer = 5, fraction = 2, message = "Valor total deve ter no máximo 5 dígitos inteiros e 2 decimais")
    @Schema(description = "Valor total do pedido (calculado automaticamente se não informado)", 
            example = "89.90", minimum = "0.00", maximum = "99999.99")
    private BigDecimal totalAmount;
    
    @DecimalMin(value = "0.00", message = "Taxa de entrega não pode ser negativa")
    @DecimalMax(value = "999.99", message = "Taxa de entrega deve ser menor que R$ 999,99")
    @Digits(integer = 3, fraction = 2, message = "Taxa de entrega deve ter no máximo 3 dígitos inteiros e 2 decimais")
    @Schema(description = "Taxa de entrega", example = "5.90", 
            minimum = "0.00", maximum = "999.99", defaultValue = "0.00")
    private BigDecimal deliveryFee;
    
    @DecimalMin(value = "0.00", message = "Desconto não pode ser negativo")
    @DecimalMax(value = "999.99", message = "Desconto deve ser menor que R$ 999,99")
    @Digits(integer = 3, fraction = 2, message = "Desconto deve ter no máximo 3 dígitos inteiros e 2 decimais")
    @Schema(description = "Valor do desconto aplicado", example = "10.00", 
            minimum = "0.00", maximum = "999.99", defaultValue = "0.00")
    private BigDecimal discount;
    
    @Length(max = 50, message = "Código do cupom deve ter no máximo 50 caracteres")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Código do cupom deve conter apenas letras maiúsculas, números e hífens")
    @Schema(description = "Código do cupom de desconto", example = "DESCONTO10", maxLength = 50)
    private String couponCode;
    
    @Schema(description = "Método de pagamento", example = "CREDIT_CARD",
            allowableValues = {"CREDIT_CARD", "DEBIT_CARD", "PIX", "CASH", "VOUCHER"})
    private String paymentMethod;
    
    @Length(max = 100, message = "Telefone de contato deve ter no máximo 100 caracteres")
    @Pattern(regexp = "^\\(?[1-9]{2}\\)?[0-9]{4,5}-?[0-9]{4}$", 
             message = "Telefone de contato deve ter formato válido")
    @Schema(description = "Telefone de contato para entrega", example = "(11) 99999-9999", maxLength = 100)
    private String contactPhone;
    
    @Min(value = 0, message = "Tempo estimado não pode ser negativo")
    @Max(value = 480, message = "Tempo estimado deve ser no máximo 8 horas (480 minutos)")
    @Schema(description = "Tempo estimado de entrega em minutos", example = "45", 
            minimum = "0", maximum = "480")
    private Integer estimatedDeliveryTime;
    
    @Schema(description = "Pedido é para presente", example = "false", defaultValue = "false")
    private Boolean isGift;
    
    @Length(max = 200, message = "Mensagem do presente deve ter no máximo 200 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s0-9,.!?'\"()-]+$", 
             message = "Mensagem do presente contém caracteres inválidos")
    @Schema(description = "Mensagem para presente", example = "Parabéns pelo aniversário!", maxLength = 200)
    private String giftMessage;
    
    @Data
    @Schema(description = "Item do pedido")
    public static class OrderItemRequestDto {
        
        @NotNull(message = "ID do produto é obrigatório")
        @Positive(message = "ID do produto deve ser positivo")
        @Schema(description = "ID do produto", example = "1", required = true)
        private Long productId;
        
        @NotNull(message = "Quantidade é obrigatória")
        @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
        @Max(value = 99, message = "Quantidade deve ser no máximo 99")
        @Schema(description = "Quantidade do produto", example = "2", required = true, 
                minimum = "1", maximum = "99")
        private Integer quantity;
        
        @DecimalMin(value = "0.01", message = "Preço unitário deve ser maior que zero")
        @DecimalMax(value = "9999.99", message = "Preço unitário deve ser menor que R$ 9.999,99")
        @Digits(integer = 4, fraction = 2, message = "Preço unitário deve ter no máximo 4 dígitos inteiros e 2 decimais")
        @Schema(description = "Preço unitário do produto no momento do pedido", example = "29.90", 
                minimum = "0.01", maximum = "9999.99")
        private BigDecimal unitPrice;
        
        @Length(max = 300, message = "Observações do item devem ter no máximo 300 caracteres")
        @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s0-9,.!?'\"()-]+$", 
                 message = "Observações do item contêm caracteres inválidos")
        @Schema(description = "Observações específicas do item", 
                example = "Sem cebola, massa fina", maxLength = 300)
        private String itemNotes;
        
        @Schema(description = "Personalizações do produto em formato JSON", 
                example = "{\"tamanho\": \"grande\", \"borda\": \"catupiry\"}")
        private String customizations;
    }
}