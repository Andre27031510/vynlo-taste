package com.vynlotaste.notification;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class PushNotificationService {
    
    public void sendOrderStatusPush(Long customerId, String orderNumber, String status) {
        try {
            String title = "Status do Pedido Atualizado";
            String body = String.format("Seu pedido %s está %s", orderNumber, getStatusMessage(status));
            
            // Buscar token FCM do cliente
            String fcmToken = getCustomerFcmToken(customerId);
            
            if (fcmToken != null) {
                sendPushNotification(fcmToken, title, body);
            }
            
            log.info("Push notification sent for order: {}", orderNumber);
        } catch (Exception e) {
            log.error("Failed to send push notification for order: {}", orderNumber, e);
        }
    }
    
    public void sendPriceChangeNotification(Long productId, String productName, BigDecimal newPrice) {
        try {
            String title = "Mudança de Preço";
            String body = String.format("%s agora por R$ %.2f", productName, newPrice);
            
            // Buscar usuários interessados no produto
            // sendToInterestedUsers(productId, title, body);
            
            log.info("Price change notification sent for product: {}", productId);
        } catch (Exception e) {
            log.error("Failed to send price change notification for product: {}", productId, e);
        }
    }
    
    private void sendPushNotification(String fcmToken, String title, String body) {
        try {
            Message message = Message.builder()
                .setNotification(Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build())
                .setToken(fcmToken)
                .build();
            
            String response = FirebaseMessaging.getInstance().send(message);
            log.debug("Push notification sent successfully: {}", response);
        } catch (Exception e) {
            log.error("Failed to send push notification", e);
        }
    }
    
    private String getCustomerFcmToken(Long customerId) {
        // Implementar busca do token FCM do cliente
        return null;
    }
    
    private String getStatusMessage(String status) {
        return switch (status) {
            case "CONFIRMED" -> "confirmado";
            case "PREPARING" -> "sendo preparado";
            case "READY" -> "pronto para retirada";
            case "DELIVERED" -> "entregue";
            default -> status.toLowerCase();
        };
    }
}