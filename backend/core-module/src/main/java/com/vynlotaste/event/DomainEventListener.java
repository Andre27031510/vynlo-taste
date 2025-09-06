package com.vynlotaste.event;

import com.vynlotaste.notification.NotificationService;
import com.vynlotaste.webhook.WebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DomainEventListener {
    
    private final WebhookService webhookService;
    private final NotificationService notificationService;
    
    @Async
    @EventListener
    public void handleOrderStatusChanged(OrderStatusChangedEvent event) {
        log.info("Processing OrderStatusChanged event: {}", event.getEventId());
        
        try {
            // Enviar webhook para integrações externas
            webhookService.sendWebhook("order.status.changed", event);
            
            // Enviar notificação para o cliente
            notificationService.sendOrderStatusNotification(event);
            
            log.info("OrderStatusChanged event processed successfully: {}", event.getEventId());
        } catch (Exception e) {
            log.error("Failed to process OrderStatusChanged event: {}", event.getEventId(), e);
        }
    }
    
    @Async
    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("Processing UserRegistered event: {}", event.getEventId());
        
        try {
            // Enviar webhook
            webhookService.sendWebhook("user.registered", event);
            
            // Enviar email de boas-vindas
            notificationService.sendWelcomeEmail(event);
            
            log.info("UserRegistered event processed successfully: {}", event.getEventId());
        } catch (Exception e) {
            log.error("Failed to process UserRegistered event: {}", event.getEventId(), e);
        }
    }
    
    @Async
    @EventListener
    public void handleProductUpdated(ProductUpdatedEvent event) {
        log.info("Processing ProductUpdated event: {}", event.getEventId());
        
        try {
            // Enviar webhook
            webhookService.sendWebhook("product.updated", event);
            
            // Notificar sobre mudanças de preço ou estoque
            if ("PRICE_CHANGE".equals(event.getUpdateType()) || "STOCK_UPDATE".equals(event.getUpdateType())) {
                notificationService.sendProductUpdateNotification(event);
            }
            
            log.info("ProductUpdated event processed successfully: {}", event.getEventId());
        } catch (Exception e) {
            log.error("Failed to process ProductUpdated event: {}", event.getEventId(), e);
        }
    }
}