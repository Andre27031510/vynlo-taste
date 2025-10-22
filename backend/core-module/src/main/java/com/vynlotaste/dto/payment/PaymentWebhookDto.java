package com.vynlotaste.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO para webhooks de pagamento
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWebhookDto {

    private String transactionId;
    private String provider;
    private String status;
    private String method;
    private BigDecimal amount;
    private String currency;
    private String cardBrand;
    private String orderId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String description;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;
    private String signature;
    private String rawData;

    /**
     * Status possíveis do webhook
     */
    public enum Status {
        APPROVED("Aprovado"),
        DECLINED("Recusado"),
        PENDING("Pendente"),
        CANCELLED("Cancelado"),
        REFUNDED("Estornado"),
        FAILED("Falhou");

        private final String description;

        Status(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Métodos de pagamento suportados
     */
    public enum Method {
        CREDIT_CARD("Cartão de Crédito"),
        DEBIT_CARD("Cartão de Débito"),
        PIX("PIX"),
        CASH("Dinheiro"),
        BANK_TRANSFER("Transferência Bancária");

        private final String description;

        Method(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Provedores suportados
     */
    public enum Provider {
        STONE("Stone"),
        CIELO("Cielo"),
        REDE("Rede"),
        PAGSEGURO("PagSeguro"),
        PIX("PIX"),
        SICRED("Sicred");

        private final String description;

        Provider(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
