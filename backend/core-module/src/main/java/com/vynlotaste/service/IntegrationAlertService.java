package com.vynlotaste.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * ✅ FASE 3: Serviço de Alertas para Falhas de Integração
 * Monitora e alerta sobre falhas na integração financeira
 * 
 * Funcionalidades:
 * - Detecção de falhas críticas
 * - Alertas por threshold de falhas
 * - Alertas por tempo de resposta
 * - Alertas por componentes inativos
 * - Rate limiting para evitar spam de alertas
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IntegrationAlertService {

    // Thresholds para alertas
    private static final int MAX_FAILURES_PER_MINUTE = 10;
    private static final int MAX_FAILURES_PER_HOUR = 50;
    private static final long MAX_RESPONSE_TIME_MS = 5000; // 5 segundos
    private static final int ALERT_COOLDOWN_MINUTES = 5; // 5 minutos entre alertas

    // Contadores de falhas por componente
    private final ConcurrentHashMap<String, AtomicInteger> failuresPerMinute = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicInteger> failuresPerHour = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> lastAlertTime = new ConcurrentHashMap<>();

    // Contadores de tempo de resposta
    private final ConcurrentHashMap<String, AtomicLong> maxResponseTime = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> avgResponseTime = new ConcurrentHashMap<>();

    /**
     * Registrar falha de integração
     */
    public void recordIntegrationFailure(String component, String failureType, String details) {
        log.warn("🚨 Falha de integração detectada - Componente: {}, Tipo: {}, Detalhes: {}", 
            component, failureType, details);

        // Incrementar contadores
        incrementFailureCount(component);

        // Verificar thresholds e gerar alertas
        checkFailureThresholds(component, failureType, details);
    }

    /**
     * Registrar tempo de resposta
     */
    public void recordResponseTime(String component, long responseTimeMs) {
        // Atualizar tempo máximo
        maxResponseTime.computeIfAbsent(component, k -> new AtomicLong(0))
            .updateAndGet(current -> Math.max(current, responseTimeMs));

        // Atualizar tempo médio (simplificado)
        avgResponseTime.computeIfAbsent(component, k -> new AtomicLong(0))
            .updateAndGet(current -> (current + responseTimeMs) / 2);

        // Verificar threshold de tempo de resposta
        if (responseTimeMs > MAX_RESPONSE_TIME_MS) {
            recordSlowResponse(component, responseTimeMs);
        }
    }

    /**
     * Verificar se componente está saudável
     */
    public boolean isComponentHealthy(String component) {
        int failuresLastMinute = failuresPerMinute.getOrDefault(component, new AtomicInteger(0)).get();
        int failuresLastHour = failuresPerHour.getOrDefault(component, new AtomicInteger(0)).get();
        long maxResponse = maxResponseTime.getOrDefault(component, new AtomicLong(0)).get();

        return failuresLastMinute < MAX_FAILURES_PER_MINUTE && 
               failuresLastHour < MAX_FAILURES_PER_HOUR && 
               maxResponse < MAX_RESPONSE_TIME_MS;
    }

    /**
     * Obter estatísticas de um componente
     */
    public ComponentStats getComponentStats(String component) {
        return ComponentStats.builder()
            .component(component)
            .failuresLastMinute(failuresPerMinute.getOrDefault(component, new AtomicInteger(0)).get())
            .failuresLastHour(failuresPerHour.getOrDefault(component, new AtomicInteger(0)).get())
            .maxResponseTimeMs(maxResponseTime.getOrDefault(component, new AtomicLong(0)).get())
            .avgResponseTimeMs(avgResponseTime.getOrDefault(component, new AtomicLong(0)).get())
            .isHealthy(isComponentHealthy(component))
            .lastAlertTime(lastAlertTime.getOrDefault(component, new AtomicLong(0)).get())
            .build();
    }

    /**
     * Resetar contadores de falhas (chamado periodicamente)
     */
    public void resetFailureCounters() {
        log.debug("🔄 Resetando contadores de falhas");
        failuresPerMinute.clear();
        failuresPerHour.clear();
    }

    /**
     * Resetar contadores de tempo de resposta (chamado periodicamente)
     */
    public void resetResponseTimeCounters() {
        log.debug("🔄 Resetando contadores de tempo de resposta");
        maxResponseTime.clear();
        avgResponseTime.clear();
    }

    // Métodos privados

    private void incrementFailureCount(String component) {
        failuresPerMinute.computeIfAbsent(component, k -> new AtomicInteger(0)).incrementAndGet();
        failuresPerHour.computeIfAbsent(component, k -> new AtomicInteger(0)).incrementAndGet();
    }

    private void checkFailureThresholds(String component, String failureType, String details) {
        int failuresLastMinute = failuresPerMinute.getOrDefault(component, new AtomicInteger(0)).get();
        int failuresLastHour = failuresPerHour.getOrDefault(component, new AtomicInteger(0)).get();

        // Verificar threshold por minuto
        if (failuresLastMinute >= MAX_FAILURES_PER_MINUTE) {
            generateAlert(component, "HIGH_FAILURE_RATE_PER_MINUTE", 
                String.format("Componente %s teve %d falhas no último minuto", component, failuresLastMinute));
        }

        // Verificar threshold por hora
        if (failuresLastHour >= MAX_FAILURES_PER_HOUR) {
            generateAlert(component, "HIGH_FAILURE_RATE_PER_HOUR", 
                String.format("Componente %s teve %d falhas na última hora", component, failuresLastHour));
        }
    }

    private void recordSlowResponse(String component, long responseTimeMs) {
        generateAlert(component, "SLOW_RESPONSE_TIME", 
            String.format("Componente %s teve tempo de resposta lento: %dms", component, responseTimeMs));
    }

    private void generateAlert(String component, String alertType, String message) {
        long currentTime = System.currentTimeMillis();
        long lastAlert = lastAlertTime.getOrDefault(component, new AtomicLong(0)).get();
        
        // Rate limiting: só gerar alerta se passou o cooldown
        if (currentTime - lastAlert < ALERT_COOLDOWN_MINUTES * 60 * 1000) {
            log.debug("⏳ Alert cooldown ativo para componente {} - pulando alerta", component);
            return;
        }

        // Gerar alerta
        log.error("🚨 ALERTA DE INTEGRAÇÃO - Componente: {}, Tipo: {}, Mensagem: {}", 
            component, alertType, message);

        // Registrar tempo do último alerta
        lastAlertTime.computeIfAbsent(component, k -> new AtomicLong(0)).set(currentTime);

        // Em produção, aqui seria enviado para sistemas de monitoramento
        // (Slack, PagerDuty, email, etc.)
        sendAlertToMonitoringSystem(component, alertType, message);
    }

    private void sendAlertToMonitoringSystem(String component, String alertType, String message) {
        // TODO: Implementar integração com sistemas de monitoramento
        // - Slack webhook
        // - PagerDuty API
        // - Email SMTP
        // - Grafana alerts
        
        log.info("📧 [SIMULADO] Enviando alerta para sistema de monitoramento: {} - {}", component, message);
    }

    // DTO para estatísticas
    public static class ComponentStats {
        private String component;
        private int failuresLastMinute;
        private int failuresLastHour;
        private long maxResponseTimeMs;
        private long avgResponseTimeMs;
        private boolean isHealthy;
        private long lastAlertTime;

        public static ComponentStatsBuilder builder() {
            return new ComponentStatsBuilder();
        }

        // Getters e setters
        public String getComponent() { return component; }
        public void setComponent(String component) { this.component = component; }
        public int getFailuresLastMinute() { return failuresLastMinute; }
        public void setFailuresLastMinute(int failuresLastMinute) { this.failuresLastMinute = failuresLastMinute; }
        public int getFailuresLastHour() { return failuresLastHour; }
        public void setFailuresLastHour(int failuresLastHour) { this.failuresLastHour = failuresLastHour; }
        public long getMaxResponseTimeMs() { return maxResponseTimeMs; }
        public void setMaxResponseTimeMs(long maxResponseTimeMs) { this.maxResponseTimeMs = maxResponseTimeMs; }
        public long getAvgResponseTimeMs() { return avgResponseTimeMs; }
        public void setAvgResponseTimeMs(long avgResponseTimeMs) { this.avgResponseTimeMs = avgResponseTimeMs; }
        public boolean isHealthy() { return isHealthy; }
        public void setHealthy(boolean healthy) { isHealthy = healthy; }
        public long getLastAlertTime() { return lastAlertTime; }
        public void setLastAlertTime(long lastAlertTime) { this.lastAlertTime = lastAlertTime; }

        public static class ComponentStatsBuilder {
            private String component;
            private int failuresLastMinute;
            private int failuresLastHour;
            private long maxResponseTimeMs;
            private long avgResponseTimeMs;
            private boolean isHealthy;
            private long lastAlertTime;

            public ComponentStatsBuilder component(String component) { this.component = component; return this; }
            public ComponentStatsBuilder failuresLastMinute(int failuresLastMinute) { this.failuresLastMinute = failuresLastMinute; return this; }
            public ComponentStatsBuilder failuresLastHour(int failuresLastHour) { this.failuresLastHour = failuresLastHour; return this; }
            public ComponentStatsBuilder maxResponseTimeMs(long maxResponseTimeMs) { this.maxResponseTimeMs = maxResponseTimeMs; return this; }
            public ComponentStatsBuilder avgResponseTimeMs(long avgResponseTimeMs) { this.avgResponseTimeMs = avgResponseTimeMs; return this; }
            public ComponentStatsBuilder isHealthy(boolean isHealthy) { this.isHealthy = isHealthy; return this; }
            public ComponentStatsBuilder lastAlertTime(long lastAlertTime) { this.lastAlertTime = lastAlertTime; return this; }

            public ComponentStats build() {
                ComponentStats stats = new ComponentStats();
                stats.setComponent(component);
                stats.setFailuresLastMinute(failuresLastMinute);
                stats.setFailuresLastHour(failuresLastHour);
                stats.setMaxResponseTimeMs(maxResponseTimeMs);
                stats.setAvgResponseTimeMs(avgResponseTimeMs);
                stats.setHealthy(isHealthy);
                stats.setLastAlertTime(lastAlertTime);
                return stats;
            }
        }
    }
}
