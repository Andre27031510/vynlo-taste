package com.vynlotaste.notification;

import org.springframework.stereotype.Service;

@Service
public class NotificationTemplateService {
    
    public String getOrderStatusSubject(String status) {
        return switch (status) {
            case "CONFIRMED" -> "Pedido Confirmado - Vynlo Taste";
            case "PREPARING" -> "Pedido em Preparo - Vynlo Taste";
            case "READY" -> "Pedido Pronto - Vynlo Taste";
            case "DELIVERED" -> "Pedido Entregue - Vynlo Taste";
            default -> "Atualização do Pedido - Vynlo Taste";
        };
    }
    
    public String getOrderStatusBody(String orderNumber, String status) {
        String statusMessage = switch (status) {
            case "CONFIRMED" -> "foi confirmado e está sendo processado";
            case "PREPARING" -> "está sendo preparado com carinho";
            case "READY" -> "está pronto para retirada";
            case "DELIVERED" -> "foi entregue com sucesso";
            default -> "teve seu status atualizado";
        };
        
        return String.format("""
            Olá!
            
            Seu pedido %s %s.
            
            Acompanhe o status em tempo real pelo nosso app.
            
            Obrigado por escolher o Vynlo Taste!
            
            Atenciosamente,
            Equipe Vynlo Taste
            """, orderNumber, statusMessage);
    }
    
    public String getWelcomeEmailBody(String firstName) {
        return String.format("""
            Olá %s!
            
            Seja bem-vindo(a) ao Vynlo Taste! 🍕
            
            Estamos muito felizes em tê-lo(a) conosco. Agora você pode:
            
            ✅ Fazer pedidos online
            ✅ Acompanhar entregas em tempo real
            ✅ Receber ofertas exclusivas
            ✅ Avaliar nossos produtos
            
            Faça seu primeiro pedido e ganhe 10%% de desconto com o cupom: BEMVINDO10
            
            Bom apetite!
            
            Equipe Vynlo Taste
            """, firstName);
    }
}