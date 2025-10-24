package com.vynlotaste.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicLong;

/**
 * ✅ FASE 3: Serviço de Métricas para Integração Financeira
 * Monitora performance e saúde da integração entre módulos
 * 
 * Métricas implementadas:
 * - Contadores: Pagamentos processados, transações criadas, entradas de caixa
 * - Timers: Tempo de processamento de pagamentos, criação de transações
 * - Gauges: Transações pendentes, falhas de integração (corrigido conflito de nomes)
 * - Distribution: Valores de pagamentos, tempos de processamento
 * 
 * CORREÇÃO: Renomeado gauge de "failures" para "failures.current" para evitar conflito com counter
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FinancialIntegrationMetricsService {

    private final MeterRegistry meterRegistry;

    // Timers para performance
    private Timer paymentProcessingTime;
    private Timer financialTransactionCreationTime;
    private Timer cashFlowCreationTime;
    private Timer totalIntegrationTime;

    // Gauges para estado atual
    private final AtomicLong pendingFinancialTransactions = new AtomicLong(0);
    private final AtomicLong failedIntegrations = new AtomicLong(0);
    private final AtomicLong totalRevenueProcessed = new AtomicLong(0);

    // Distribution summaries para análise
    private DistributionSummary paymentAmountDistribution;

    @PostConstruct
    public void initializeMetrics() {
        log.info("🔧 Inicializando métricas de integração financeira");

        // Timers
        paymentProcessingTime = Timer.builder("vynlo.financial.payment.processing.time")
            .description("Time to process a payment")
            .register(meterRegistry);

        financialTransactionCreationTime = Timer.builder("vynlo.financial.transaction.creation.time")
            .description("Time to create a financial transaction")
            .register(meterRegistry);

        cashFlowCreationTime = Timer.builder("vynlo.financial.cashflow.creation.time")
            .description("Time to create a cash flow entry")
            .register(meterRegistry);

        totalIntegrationTime = Timer.builder("vynlo.financial.integration.total.time")
            .description("Total time for complete financial integration")
            .register(meterRegistry);

        // Gauges
        meterRegistry.gauge("vynlo.financial.transactions.pending", pendingFinancialTransactions);
        meterRegistry.gauge("vynlo.financial.integration.failures.current", failedIntegrations);
        meterRegistry.gauge("vynlo.financial.revenue.processed", totalRevenueProcessed);

        // Distribution summaries
        paymentAmountDistribution = DistributionSummary.builder("vynlo.financial.payment.amount")
            .description("Payment amount distribution")
            .register(meterRegistry);

        log.info("✅ Métricas de integração financeira inicializadas com sucesso");
    }

    // Métodos para registrar eventos

    /**
     * Registrar pagamento processado
     */
    public void recordPaymentProcessed(String paymentMethod, BigDecimal amount, boolean success) {
        Counter.builder("vynlo.financial.payments.processed")
            .tag("method", paymentMethod)
            .tag("success", String.valueOf(success))
            .register(meterRegistry)
            .increment();

        if (success) {
            paymentAmountDistribution.record(amount.doubleValue());
            totalRevenueProcessed.addAndGet(amount.longValue());
        }
    }

    /**
     * Registrar transação financeira criada
     */
    public void recordFinancialTransactionCreated(String transactionType, BigDecimal amount) {
        Counter.builder("vynlo.financial.transactions.created")
            .tag("type", transactionType)
            .register(meterRegistry)
            .increment();
    }

    /**
     * Registrar entrada de fluxo de caixa criada
     */
    public void recordCashFlowEntryCreated(String entryType, BigDecimal amount) {
        Counter.builder("vynlo.financial.cashflow.created")
            .tag("type", entryType)
            .register(meterRegistry)
            .increment();
    }

    /**
     * Registrar falha de integração
     */
    public void recordIntegrationFailure(String failureType, String component) {
        Counter.builder("vynlo.financial.integration.failures")
            .tag("failure_type", failureType)
            .tag("component", component)
            .register(meterRegistry)
            .increment();
        failedIntegrations.incrementAndGet();
    }

    /**
     * Registrar pagamento aprovado
     */
    public void recordPaymentApproved(String paymentMethod, BigDecimal amount) {
        Counter.builder("vynlo.financial.payments.approved")
            .tag("method", paymentMethod)
            .register(meterRegistry)
            .increment();
    }

    /**
     * Registrar estorno
     */
    public void recordPaymentRefunded(String paymentMethod, BigDecimal amount) {
        Counter.builder("vynlo.financial.payments.refunded")
            .tag("method", paymentMethod)
            .register(meterRegistry)
            .increment();
    }

    /**
     * Registrar tempo de processamento de pagamento
     */
    public Timer.Sample startPaymentProcessingTimer() {
        return Timer.start(meterRegistry);
    }

    /**
     * Parar timer de processamento de pagamento
     */
    public void stopPaymentProcessingTimer(Timer.Sample sample) {
        sample.stop(paymentProcessingTime);
    }

    /**
     * Registrar tempo de criação de transação financeira
     */
    public Timer.Sample startFinancialTransactionCreationTimer() {
        return Timer.start(meterRegistry);
    }

    /**
     * Parar timer de criação de transação financeira
     */
    public void stopFinancialTransactionCreationTimer(Timer.Sample sample) {
        sample.stop(financialTransactionCreationTime);
    }

    /**
     * Registrar tempo de criação de fluxo de caixa
     */
    public Timer.Sample startCashFlowCreationTimer() {
        return Timer.start(meterRegistry);
    }

    /**
     * Parar timer de criação de fluxo de caixa
     */
    public void stopCashFlowCreationTimer(Timer.Sample sample) {
        sample.stop(cashFlowCreationTime);
    }

    /**
     * Registrar tempo total de integração
     */
    public Timer.Sample startTotalIntegrationTimer() {
        return Timer.start(meterRegistry);
    }

    /**
     * Parar timer total de integração
     */
    public void stopTotalIntegrationTimer(Timer.Sample sample) {
        sample.stop(totalIntegrationTime);
    }

    /**
     * Atualizar contador de transações pendentes
     */
    public void updatePendingTransactionsCount(long count) {
        pendingFinancialTransactions.set(count);
    }

    /**
     * Incrementar transações pendentes
     */
    public void incrementPendingTransactions() {
        pendingFinancialTransactions.incrementAndGet();
    }

    /**
     * Decrementar transações pendentes
     */
    public void decrementPendingTransactions() {
        pendingFinancialTransactions.decrementAndGet();
    }

    /**
     * Resetar contador de falhas
     */
    public void resetFailureCount() {
        failedIntegrations.set(0);
    }
}
