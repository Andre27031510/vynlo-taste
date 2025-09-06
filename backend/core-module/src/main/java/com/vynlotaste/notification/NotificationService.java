package com.vynlotaste.notification;

import com.vynlotaste.event.OrderStatusChangedEvent;
import com.vynlotaste.event.ProductUpdatedEvent;
import com.vynlotaste.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final EmailService emailService;
    private final SmsService smsService;
    private final PushNotificationService pushNotificationService;
    
    @Async
    public void sendOrderStatusNotification(OrderStatusChangedEvent event) {
        try {
            // Email notification
            emailService.sendOrderStatusEmail(
                event.getCustomerId(),
                event.getOrderNumber(),
                event.getNewStatus()
            );
            
            // Push notification
            pushNotificationService.sendOrderStatusPush(
                event.getCustomerId(),
                event.getOrderNumber(),
                event.getNewStatus()
            );
            
            log.info("Order status notifications sent for order: {}", event.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to send order status notifications for order: {}", event.getOrderNumber(), e);
        }
    }
    
    @Async
    public void sendWelcomeEmail(UserRegisteredEvent event) {
        try {
            emailService.sendWelcomeEmail(event.getEmail(), event.getFirstName());
            log.info("Welcome email sent to: {}", event.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", event.getEmail(), e);
        }
    }
    
    @Async
    public void sendProductUpdateNotification(ProductUpdatedEvent event) {
        try {
            if ("PRICE_CHANGE".equals(event.getUpdateType())) {
                // Notificar usuários interessados sobre mudança de preço
                pushNotificationService.sendPriceChangeNotification(
                    event.getProductId(),
                    event.getName(),
                    event.getPrice()
                );
            }
            
            log.info("Product update notification sent for product: {}", event.getProductId());
        } catch (Exception e) {
            log.error("Failed to send product update notification for product: {}", event.getProductId(), e);
        }
    }
    
    public void sendOrderNotification(String email, String subject, String message) {
        try {
            emailService.sendEmail(email, subject, message);
            log.info("Order notification sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send order notification to: {}", email, e);
        }
    }
    
    public void sendWelcomeEmail(String email, String firstName) {
        try {
            emailService.sendWelcomeEmail(email, firstName);
            log.info("Welcome email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", email, e);
        }
    }
    
    public void sendOrderStatusEmail(Long customerId, String orderNumber, String status) {
        try {
            emailService.sendOrderStatusEmail(customerId, orderNumber, status);
            log.info("Order status email sent for order: {}", orderNumber);
        } catch (Exception e) {
            log.error("Failed to send order status email for order: {}", orderNumber, e);
        }
    }
    
    public boolean isNotificationServiceAvailable() {
        try {
            return emailService != null && smsService != null && pushNotificationService != null;
        } catch (Exception e) {
            log.error("Error checking notification service availability", e);
            return false;
        }
    }
}