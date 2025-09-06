package com.vynlotaste.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final NotificationTemplateService templateService;
    
    public void sendOrderStatusEmail(Long customerId, String orderNumber, String status) {
        try {
            String subject = templateService.getOrderStatusSubject(status);
            String body = templateService.getOrderStatusBody(orderNumber, status);
            
            // Buscar email do cliente (implementar busca)
            String customerEmail = getCustomerEmail(customerId);
            
            sendEmail(customerEmail, subject, body);
            log.info("Order status email sent to customer: {}", customerId);
        } catch (Exception e) {
            log.error("Failed to send order status email to customer: {}", customerId, e);
        }
    }
    
    public void sendWelcomeEmail(String email, String firstName) {
        try {
            String subject = "Bem-vindo ao Vynlo Taste!";
            String body = templateService.getWelcomeEmailBody(firstName);
            
            sendEmail(email, subject, body);
            log.info("Welcome email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", email, e);
        }
    }
    
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("noreply@vynlotaste.com");
        
        mailSender.send(message);
    }
    
    private String getCustomerEmail(Long customerId) {
        // Implementar busca do email do cliente
        return "customer@example.com";
    }
}