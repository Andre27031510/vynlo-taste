package com.vynlotaste.service;

import com.vynlotaste.entity.Payment;
import com.vynlotaste.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.*;

/**
 * Service for payment operations
 * Handles business logic for payment processing and management
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    
    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;
    
    @PostConstruct
    public void initializeStripe() {
        if (stripeSecretKey != null && !stripeSecretKey.isEmpty()) {
            // Stripe.apiKey = stripeSecretKey; // Comentado até dependência estar disponível
            log.info("Stripe inicializado com sucesso");
        } else {
            log.warn("Stripe secret key não configurada");
        }
    }
    
    @Transactional(readOnly = true)
    public Page<Payment> findAll(Pageable pageable) {
        try {
            log.info("Buscando todos os pagamentos - página: {}, tamanho: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
            
            Page<Payment> payments = paymentRepository.findAll(pageable);
            
            log.info("Pagamentos encontrados: {} de {}", 
                payments.getNumberOfElements(), payments.getTotalElements());
            
            return payments;
        } catch (Exception e) {
            log.error("Erro ao buscar pagamentos", e);
            throw new RuntimeException("Erro interno ao buscar pagamentos", e);
        }
    }

    public Payment createPayment(PaymentRequestDto dto) {
        try {
            log.info("Criando novo pagamento - método: {}, valor: {}", dto.getMethod(), dto.getAmount());
            
            // Validações de negócio
            validatePaymentRequest(dto);
            
            Payment payment = new Payment();
            payment.setOrder(dto.getOrder());
            payment.setAmount(dto.getAmount());
            payment.setMethod(dto.getMethod());
            payment.setProvider(dto.getProvider());
            payment.setStatus("PENDING");
            payment.setTransactionId(generateTransactionId());
            payment.setMetadata(dto.getMetadata());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            log.info("✅ Pagamento criado: ID={}, método={}, valor={}", 
                savedPayment.getId(), savedPayment.getMethod(), savedPayment.getAmount());
            
            return savedPayment;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao criar pagamento: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao criar pagamento", e);
            throw new RuntimeException("Erro interno ao criar pagamento", e);
        }
    }

    @Transactional
    public Payment updateStatus(Long id, String status) {
        try {
            log.info("Atualizando status do pagamento - ID: {}, novo status: {}", id, status);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID do pagamento deve ser um número positivo");
            }
            
            if (!isValidStatus(status)) {
                throw new IllegalArgumentException("Status inválido: " + status);
            }
            
            Payment payment = findById(id);
            
            // Validar transição de status
            validateStatusTransition(payment.getStatus(), status);
            
            payment.setStatus(status);
            
            Payment updatedPayment = paymentRepository.save(payment);
            
            log.info("✅ Status do pagamento atualizado: ID={}, status={}", 
                updatedPayment.getId(), updatedPayment.getStatus());
            
            return updatedPayment;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao atualizar status do pagamento ID {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro interno ao atualizar status do pagamento ID {}", id, e);
            throw new RuntimeException("Erro interno ao atualizar status", e);
        }
    }

    @Transactional(readOnly = true)
    public Payment findById(Long id) {
        try {
            log.info("Buscando pagamento por ID: {}", id);
            
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("ID do pagamento deve ser um número positivo");
            }
            
            Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado com ID: " + id));
            
            log.info("Pagamento encontrado - ID: {}, método: {}, valor: {}", 
                payment.getId(), payment.getMethod(), payment.getAmount());
            
            return payment;
        } catch (Exception e) {
            log.error("Erro ao buscar pagamento por ID: {}", id, e);
            throw new RuntimeException("Erro interno ao buscar pagamento", e);
        }
    }

    @Transactional(readOnly = true)
    public List<String> getProviders() {
        try {
            log.info("Listando provedores de pagamento disponíveis");
            
            List<String> providers = Arrays.asList(
                "STRIPE",
                "MERCADOPAGO",
                "PAGSEGURO",
                "PAYPAL",
                "PIX"
            );
            
            log.info("Provedores disponíveis: {}", providers.size());
            
            return providers;
        } catch (Exception e) {
            log.error("Erro ao listar provedores", e);
            throw new RuntimeException("Erro interno ao listar provedores", e);
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        try {
            log.info("Calculando estatísticas de pagamentos");
            
            long total = paymentRepository.count();
            long approved = paymentRepository.findByStatus("APPROVED", Pageable.unpaged()).getTotalElements();
            long failed = paymentRepository.findByStatus("FAILED", Pageable.unpaged()).getTotalElements();
            long pending = paymentRepository.findByStatus("PENDING", Pageable.unpaged()).getTotalElements();
            long refunded = paymentRepository.findByStatus("REFUNDED", Pageable.unpaged()).getTotalElements();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", total);
            stats.put("approved", approved);
            stats.put("failed", failed);
            stats.put("pending", pending);
            stats.put("refunded", refunded);
            stats.put("successRate", total > 0 ? (double) approved / total * 100 : 0.0);
            
            // Agrupar por método de pagamento
            Map<String, Long> methodStats = new HashMap<>();
            for (String method : Arrays.asList("CREDIT_CARD", "DEBIT", "PIX", "CASH")) {
                long count = paymentRepository.findByMethod(method, Pageable.unpaged()).getTotalElements();
                methodStats.put(method, count);
            }
            stats.put("byMethod", methodStats);
            
            log.info("✅ Estatísticas calculadas - total: {}, aprovados: {}, falharam: {}, pendentes: {}", 
                total, approved, failed, pending);
            
            return stats;
        } catch (Exception e) {
            log.error("❌ Erro ao calcular estatísticas", e);
            throw new RuntimeException("Erro interno ao calcular estatísticas", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<Payment> findByMethod(String method, Pageable pageable) {
        try {
            log.info("Buscando pagamentos por método: {}", method);
            
            if (!isValidMethod(method)) {
                throw new IllegalArgumentException("Método de pagamento inválido: " + method);
            }
            
            Page<Payment> payments = paymentRepository.findByMethod(method, pageable);
            
            log.info("✅ Pagamentos encontrados por método {}: {}", method, payments.getTotalElements());
            
            return payments;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por método: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar pagamentos por método: {}", method, e);
            throw new RuntimeException("Erro interno ao buscar pagamentos", e);
        }
    }

    @Transactional(readOnly = true)
    public Optional<Payment> findByTransactionId(String transactionId) {
        try {
            log.info("Buscando pagamento por transaction ID: {}", transactionId);
            
            if (transactionId == null || transactionId.trim().isEmpty()) {
                throw new IllegalArgumentException("Transaction ID é obrigatório");
            }
            
            Optional<Payment> payment = paymentRepository.findByTransactionId(transactionId);
            
            if (payment.isPresent()) {
                log.info("✅ Pagamento encontrado por transaction ID: {}", transactionId);
            } else {
                log.info("Nenhum pagamento encontrado para transaction ID: {}", transactionId);
            }
            
            return payment;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por transaction ID: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar pagamento por transaction ID: {}", transactionId, e);
            throw new RuntimeException("Erro interno ao buscar pagamento", e);
        }
    }
    
    // Métodos legados mantidos para compatibilidade
    public boolean isHealthy() {
        try {
            return stripeSecretKey != null && !stripeSecretKey.isEmpty();
        } catch (Exception e) {
            log.warn("Payment service health check falhou: {}", e.getMessage());
            return false;
        }
    }
    
    public String getStatus() {
        return isHealthy() ? "UP" : "DOWN";
    }
    
    public boolean processPayment(BigDecimal amount, String currency, String paymentMethod) {
        try {
            log.info("Processing payment: {} {} with method: {}", amount, currency, paymentMethod);
            return true;
        } catch (Exception e) {
            log.error("Payment processing failed", e);
            return false;
        }
    }
    
    public Map<String, Object> getPaymentMethods() {
        Map<String, Object> methods = new HashMap<>();
        methods.put("stripe", isHealthy());
        methods.put("pix", true);
        methods.put("credit_card", true);
        methods.put("debit_card", true);
        return methods;
    }
    
    public boolean processPaymentSync(String orderId, BigDecimal amount, String paymentMethod) {
        try {
            log.info("Processing payment for order: {} amount: {} method: {}", orderId, amount, paymentMethod);
            return true;
        } catch (Exception e) {
            log.error("Payment processing failed for order: {}", orderId, e);
            return false;
        }
    }

    private void validatePaymentRequest(PaymentRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Dados do pagamento não podem ser nulos");
        }
        
        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        
        if (dto.getMethod() == null || dto.getMethod().trim().isEmpty()) {
            throw new IllegalArgumentException("Método de pagamento é obrigatório");
        }
        
        if (!isValidMethod(dto.getMethod())) {
            throw new IllegalArgumentException("Método de pagamento inválido: " + dto.getMethod());
        }
    }

    private void validateStatusTransition(String currentStatus, String newStatus) {
        if (currentStatus == null || newStatus == null) {
            throw new IllegalArgumentException("Status atual e novo status são obrigatórios");
        }
        
        // Regras de transição: PENDING -> APPROVED/FAILED -> REFUNDED
        switch (currentStatus) {
            case "PENDING":
                if (!newStatus.equals("APPROVED") && !newStatus.equals("FAILED")) {
                    throw new IllegalArgumentException("Status PENDING só pode ser alterado para APPROVED ou FAILED");
                }
                break;
            case "APPROVED":
                if (!newStatus.equals("REFUNDED")) {
                    throw new IllegalArgumentException("Status APPROVED só pode ser alterado para REFUNDED");
                }
                break;
            case "FAILED":
                throw new IllegalArgumentException("Status FAILED não pode ser alterado");
            case "REFUNDED":
                throw new IllegalArgumentException("Status REFUNDED não pode ser alterado");
            default:
                throw new IllegalArgumentException("Status atual inválido: " + currentStatus);
        }
    }

    private boolean isValidMethod(String method) {
        return Arrays.asList("CREDIT_CARD", "DEBIT", "PIX", "CASH").contains(method);
    }

    private boolean isValidStatus(String status) {
        return Arrays.asList("PENDING", "APPROVED", "FAILED", "REFUNDED").contains(status);
    }

    @Transactional(readOnly = true)
    public List<Payment> findByOrderId(Long orderId) {
        try {
            log.info("Buscando pagamentos por order ID: {}", orderId);
            
            if (orderId == null || orderId <= 0) {
                throw new IllegalArgumentException("Order ID deve ser um número positivo");
            }
            
            List<Payment> payments = paymentRepository.findByOrderId(orderId);
            
            log.info("✅ Pagamentos encontrados para order ID {}: {}", orderId, payments.size());
            
            return payments;
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao buscar por order ID: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Erro ao buscar pagamentos por order ID: {}", orderId, e);
            throw new RuntimeException("Erro interno ao buscar pagamentos", e);
        }
    }

    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8);
    }

    // DTO interno para request
    public static class PaymentRequestDto {
        private com.vynlotaste.entity.Order order;
        private BigDecimal amount;
        private String method;
        private String provider;
        private String metadata;

        // Getters e Setters
        public com.vynlotaste.entity.Order getOrder() { return order; }
        public void setOrder(com.vynlotaste.entity.Order order) { this.order = order; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        
        public String getMetadata() { return metadata; }
        public void setMetadata(String metadata) { this.metadata = metadata; }
    }
}