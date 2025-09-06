package com.vynlotaste.dto.order;

import com.vynlotaste.dto.user.UserResponseDto;
import com.vynlotaste.entity.Order;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "Dados de resposta do pedido")
public class OrderResponseDto {
    
    @Schema(description = "ID único do pedido", example = "1")
    private Long id;
    
    @Schema(description = "Número do pedido", example = "ORD-1704067200000")
    private String orderNumber;
    
    @Schema(description = "Status do pedido", example = "CONFIRMED")
    private Order.OrderStatus status;
    
    @Schema(description = "Tipo do pedido", example = "DELIVERY")
    private Order.OrderType type;
    
    @Schema(description = "Valor total do pedido", example = "89.90")
    private BigDecimal totalAmount;
    
    @Schema(description = "Taxa de entrega", example = "5.90")
    private BigDecimal deliveryFee;
    
    @Schema(description = "Desconto aplicado", example = "10.00")
    private BigDecimal discount;
    
    @Schema(description = "Valor final (total + taxa - desconto)", example = "85.80")
    private BigDecimal finalAmount;
    
    @Schema(description = "Endereço de entrega", example = "Rua das Flores, 123, Apt 45, Centro, São Paulo - SP")
    private String deliveryAddress;
    
    @Schema(description = "Observações do pedido", example = "Sem cebola na pizza, entregar no portão dos fundos")
    private String notes;
    
    @Schema(description = "Dados do cliente")
    private UserResponseDto customer;
    
    @Schema(description = "Lista de itens do pedido")
    private List<OrderItemResponseDto> items;
    
    @Schema(description = "Código do cupom utilizado", example = "DESCONTO10")
    private String couponCode;
    
    @Schema(description = "Método de pagamento", example = "CREDIT_CARD")
    private String paymentMethod;
    
    @Schema(description = "Status do pagamento", example = "PAID")
    private String paymentStatus;
    
    @Schema(description = "Telefone de contato", example = "(11) 99999-9999")
    private String contactPhone;
    
    @Schema(description = "Tempo estimado de entrega em minutos", example = "45")
    private Integer estimatedDeliveryTime;
    
    @Schema(description = "Tempo real de preparo em minutos", example = "38")
    private Integer actualPreparationTime;
    
    @Schema(description = "Pedido é presente", example = "false")
    private Boolean isGift;
    
    @Schema(description = "Mensagem do presente", example = "Parabéns pelo aniversário!")
    private String giftMessage;
    
    @Schema(description = "Data de criação do pedido", example = "2024-01-01T10:00:00Z")
    private LocalDateTime createdAt;
    
    @Schema(description = "Data de atualização do pedido", example = "2024-01-01T10:30:00Z")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Data de confirmação do pedido", example = "2024-01-01T10:05:00Z")
    private LocalDateTime confirmedAt;
    
    @Schema(description = "Data de entrega do pedido", example = "2024-01-01T11:00:00Z")
    private LocalDateTime deliveredAt;
    
    @Schema(description = "Avaliação do pedido (1-5)", example = "5")
    private Integer rating;
    
    @Schema(description = "Comentário da avaliação", example = "Excelente! Pizza chegou quentinha e no prazo.")
    private String ratingComment;
    
    @Schema(description = "Status formatado para exibição", example = "Confirmado")
    private String statusDisplay;
    
    @Schema(description = "Tempo restante estimado em minutos", example = "25")
    private Integer remainingTime;
    
    @Schema(description = "Progresso do pedido em porcentagem", example = "60")
    private Integer progressPercentage;
    
    @Data
    @Schema(description = "Item do pedido na resposta")
    public static class OrderItemResponseDto {
        
        @Schema(description = "ID do item", example = "1")
        private Long id;
        
        @Schema(description = "ID do produto", example = "1")
        private Long productId;
        
        @Schema(description = "Nome do produto", example = "Pizza Margherita")
        private String productName;
        
        @Schema(description = "Imagem do produto", example = "https://exemplo.com/pizza-margherita.jpg")
        private String productImage;
        
        @Schema(description = "Quantidade", example = "2")
        private Integer quantity;
        
        @Schema(description = "Preço unitário", example = "29.90")
        private BigDecimal unitPrice;
        
        @Schema(description = "Preço total do item", example = "59.80")
        private BigDecimal totalPrice;
        
        @Schema(description = "Observações do item", example = "Sem cebola, massa fina")
        private String itemNotes;
        
        @Schema(description = "Personalizações aplicadas", example = "{\"tamanho\": \"grande\", \"borda\": \"catupiry\"}")
        private String customizations;
        
        @Schema(description = "Status do item", example = "PREPARING")
        private String itemStatus;
        
        @Schema(description = "Tempo de preparo estimado em minutos", example = "30")
        private Integer preparationTime;
    }
}