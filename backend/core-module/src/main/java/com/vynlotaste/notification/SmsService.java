package com.vynlotaste.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsService {
    
    public void sendOrderStatusSms(String phoneNumber, String orderNumber, String status) {
        try {
            String message = String.format(
                "Vynlo Taste: Seu pedido %s está %s. Acompanhe pelo app!",
                orderNumber, getStatusMessage(status)
            );
            
            // Integração com provedor de SMS (Twilio, AWS SNS, etc.)
            sendSms(phoneNumber, message);
            
            log.info("SMS sent to: {}", phoneNumber);
        } catch (Exception e) {
            log.error("Failed to send SMS to: {}", phoneNumber, e);
        }
    }
    
    private void sendSms(String phoneNumber, String message) {
        // Implementar integração com provedor de SMS
        log.info("SMS would be sent to {}: {}", phoneNumber, message);
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