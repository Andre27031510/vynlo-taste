package com.vynlotaste.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Supplier;

/**
 * ✅ FASE 4: Serviço de Retry com Backoff Exponencial
 * Implementa retry automático com backoff exponencial para operações críticas
 * 
 * Funcionalidades:
 * - Retry automático com backoff exponencial
 * - Execução assíncrona para não bloquear threads
 * - Recuperação personalizada após falhas
 * - Configuração flexível por tipo de operação
 * - Métricas de retry para monitoramento
 * 
 * NOTA: Usa Spring Retry (@Retryable) com configurações otimizadas para produção
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RetryService {

    private final FinancialIntegrationMetricsService metricsService;
    private final IntegrationAlertService alertService;
    
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    /**
     * Executar operação com retry automático
     */
    @Retryable(
        value = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2, maxDelay = 10000)
    )
    public <T> T executeWithRetry(String operationName, Supplier<T> operation) {
        log.debug("🔄 Executando operação com retry: {}", operationName);
        
        try {
            T result = operation.get();
            log.debug("✅ Operação executada com sucesso: {}", operationName);
            return result;
        } catch (Exception e) {
            log.warn("⚠️ Falha na operação {}: {}", operationName, e.getMessage());
            throw e;
        }
    }

    /**
     * Executar operação assíncrona com retry
     */
    public <T> CompletableFuture<T> executeAsyncWithRetry(String operationName, Supplier<T> operation) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return executeWithRetry(operationName, operation);
            } catch (Exception e) {
                log.error("❌ Falha final na operação assíncrona {}: {}", operationName, e.getMessage());
                throw new RuntimeException(e);
            }
        }, executorService);
    }

    /**
     * Executar operação de integração financeira com retry
     */
    @Retryable(
        value = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2, maxDelay = 15000)
    )
    public void executeFinancialIntegrationWithRetry(String operationName, Runnable operation) {
        log.info("💰 Executando integração financeira com retry: {}", operationName);
        
        try {
            operation.run();
            log.info("✅ Integração financeira executada com sucesso: {}", operationName);
        } catch (Exception e) {
            log.warn("⚠️ Falha na integração financeira {}: {}", operationName, e.getMessage());
            metricsService.recordIntegrationFailure("RETRY_ATTEMPT", operationName);
            throw e;
        }
    }

    /**
     * Executar operação de webhook com retry
     */
    @Retryable(
        value = {Exception.class},
        maxAttempts = 5,
        backoff = @Backoff(delay = 1000, multiplier = 1.5, maxDelay = 30000)
    )
    public <T> T executeWebhookWithRetry(String provider, String operationName, Supplier<T> operation) {
        log.info("🔔 Executando webhook com retry: {} - {}", provider, operationName);
        
        try {
            T result = operation.get();
            log.info("✅ Webhook executado com sucesso: {} - {}", provider, operationName);
            return result;
        } catch (Exception e) {
            log.warn("⚠️ Falha no webhook {} - {}: {}", provider, operationName, e.getMessage());
            alertService.recordIntegrationFailure("WEBHOOK_RETRY", provider, e.getMessage());
            throw e;
        }
    }

    /**
     * Executar operação de pagamento com retry
     */
    @Retryable(
        value = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 3000, multiplier = 2, maxDelay = 20000)
    )
    public <T> T executePaymentWithRetry(String paymentMethod, String operationName, Supplier<T> operation) {
        log.info("💳 Executando pagamento com retry: {} - {}", paymentMethod, operationName);
        
        try {
            T result = operation.get();
            log.info("✅ Pagamento executado com sucesso: {} - {}", paymentMethod, operationName);
            return result;
        } catch (Exception e) {
            log.warn("⚠️ Falha no pagamento {} - {}: {}", paymentMethod, operationName, e.getMessage());
            metricsService.recordIntegrationFailure("PAYMENT_RETRY", paymentMethod);
            throw e;
        }
    }

    /**
     * Executar operação de transação financeira com retry
     */
    @Retryable(
        value = {Exception.class},
        maxAttempts = 4,
        backoff = @Backoff(delay = 1500, multiplier = 2, maxDelay = 12000)
    )
    public <T> T executeFinancialTransactionWithRetry(String transactionType, String operationName, Supplier<T> operation) {
        log.info("📊 Executando transação financeira com retry: {} - {}", transactionType, operationName);
        
        try {
            T result = operation.get();
            log.info("✅ Transação financeira executada com sucesso: {} - {}", transactionType, operationName);
            return result;
        } catch (Exception e) {
            log.warn("⚠️ Falha na transação financeira {} - {}: {}", transactionType, operationName, e.getMessage());
            metricsService.recordIntegrationFailure("TRANSACTION_RETRY", transactionType);
            throw e;
        }
    }

    /**
     * Executar operação de fluxo de caixa com retry
     */
    @Retryable(
        value = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 1.5, maxDelay = 10000)
    )
    public <T> T executeCashFlowWithRetry(String entryType, String operationName, Supplier<T> operation) {
        log.info("💰 Executando fluxo de caixa com retry: {} - {}", entryType, operationName);
        
        try {
            T result = operation.get();
            log.info("✅ Fluxo de caixa executado com sucesso: {} - {}", entryType, operationName);
            return result;
        } catch (Exception e) {
            log.warn("⚠️ Falha no fluxo de caixa {} - {}: {}", entryType, operationName, e.getMessage());
            metricsService.recordIntegrationFailure("CASHFLOW_RETRY", entryType);
            throw e;
        }
    }

    // Métodos de recuperação (@Recover)

    /**
     * Recuperação para operações gerais
     */
    @Recover
    public <T> T recoverGeneralOperation(Exception ex, String operationName, Supplier<T> operation) {
        log.error("❌ Recuperação para operação geral: {} - {}", operationName, ex.getMessage());
        metricsService.recordIntegrationFailure("RECOVERY_GENERAL", operationName);
        alertService.recordIntegrationFailure("RECOVERY_GENERAL", operationName, ex.getMessage());
        throw new RuntimeException("Operação falhou após retry: " + operationName, ex);
    }

    /**
     * Recuperação para integração financeira
     */
    @Recover
    public void recoverFinancialIntegration(Exception ex, String operationName, Runnable operation) {
        log.error("❌ Recuperação para integração financeira: {} - {}", operationName, ex.getMessage());
        metricsService.recordIntegrationFailure("RECOVERY_FINANCIAL", operationName);
        alertService.recordIntegrationFailure("RECOVERY_FINANCIAL", operationName, ex.getMessage());
        throw new RuntimeException("Integração financeira falhou após retry: " + operationName, ex);
    }

    /**
     * Recuperação para webhooks
     */
    @Recover
    public <T> T recoverWebhook(Exception ex, String provider, String operationName, Supplier<T> operation) {
        log.error("❌ Recuperação para webhook: {} - {} - {}", provider, operationName, ex.getMessage());
        metricsService.recordIntegrationFailure("RECOVERY_WEBHOOK", provider);
        alertService.recordIntegrationFailure("RECOVERY_WEBHOOK", provider, ex.getMessage());
        throw new RuntimeException("Webhook falhou após retry: " + provider + " - " + operationName, ex);
    }

    /**
     * Recuperação para pagamentos
     */
    @Recover
    public <T> T recoverPayment(Exception ex, String paymentMethod, String operationName, Supplier<T> operation) {
        log.error("❌ Recuperação para pagamento: {} - {} - {}", paymentMethod, operationName, ex.getMessage());
        metricsService.recordIntegrationFailure("RECOVERY_PAYMENT", paymentMethod);
        alertService.recordIntegrationFailure("RECOVERY_PAYMENT", paymentMethod, ex.getMessage());
        throw new RuntimeException("Pagamento falhou após retry: " + paymentMethod + " - " + operationName, ex);
    }

    /**
     * Recuperação para transações financeiras
     */
    @Recover
    public <T> T recoverFinancialTransaction(Exception ex, String transactionType, String operationName, Supplier<T> operation) {
        log.error("❌ Recuperação para transação financeira: {} - {} - {}", transactionType, operationName, ex.getMessage());
        metricsService.recordIntegrationFailure("RECOVERY_TRANSACTION", transactionType);
        alertService.recordIntegrationFailure("RECOVERY_TRANSACTION", transactionType, ex.getMessage());
        throw new RuntimeException("Transação financeira falhou após retry: " + transactionType + " - " + operationName, ex);
    }

    /**
     * Recuperação para fluxo de caixa
     */
    @Recover
    public <T> T recoverCashFlow(Exception ex, String entryType, String operationName, Supplier<T> operation) {
        log.error("❌ Recuperação para fluxo de caixa: {} - {} - {}", entryType, operationName, ex.getMessage());
        metricsService.recordIntegrationFailure("RECOVERY_CASHFLOW", entryType);
        alertService.recordIntegrationFailure("RECOVERY_CASHFLOW", entryType, ex.getMessage());
        throw new RuntimeException("Fluxo de caixa falhou após retry: " + entryType + " - " + operationName, ex);
    }

    /**
     * Verificar se operação deve ser retentada
     */
    public boolean shouldRetry(Exception ex, int attemptCount, int maxAttempts) {
        // Não retentar se excedeu máximo de tentativas
        if (attemptCount >= maxAttempts) {
            return false;
        }

        // Não retentar para erros de validação
        if (ex instanceof IllegalArgumentException || 
            ex instanceof IllegalStateException) {
            return false;
        }

        // Retentar para erros de rede, timeout, etc.
        return true;
    }

    /**
     * Calcular delay para próxima tentativa
     */
    public long calculateDelay(int attemptCount, long baseDelay, double multiplier, long maxDelay) {
        long delay = (long) (baseDelay * Math.pow(multiplier, attemptCount - 1));
        return Math.min(delay, maxDelay);
    }

    /**
     * Shutdown do executor service
     */
    public void shutdown() {
        executorService.shutdown();
    }
}
