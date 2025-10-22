package com.vynlotaste.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller para dashboard financeiro
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@RestController
@RequestMapping("/v1/financial-dashboard")
@RequiredArgsConstructor
@Slf4j
public class FinancialDashboardController {

    private final com.vynlotaste.service.FinancialDashboardService dashboardService;
    private final com.vynlotaste.service.FinancialMonitoringService monitoringService;
    private final com.vynlotaste.service.FinancialAlertService alertService;
    private final com.vynlotaste.service.FinancialMetricsService metricsService;

    /**
     * Obter métricas do dashboard
     */
    @GetMapping("/metrics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        try {
            log.debug("📊 Buscando métricas do dashboard financeiro");
            Map<String, Object> metrics = dashboardService.getDashboardMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar métricas do dashboard: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Obter métricas de performance
     */
    @GetMapping("/performance")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics() {
        try {
            log.debug("📈 Buscando métricas de performance");
            Map<String, Object> performance = dashboardService.getPerformanceMetrics();
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar métricas de performance: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Obter alertas financeiros
     */
    @GetMapping("/alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getFinancialAlerts() {
        try {
            log.debug("🚨 Buscando alertas financeiros");
            Map<String, Object> alerts = dashboardService.getFinancialAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar alertas financeiros: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Monitorar saúde financeira
     */
    @GetMapping("/health")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> monitorFinancialHealth() {
        try {
            log.debug("🔍 Monitorando saúde financeira");
            Map<String, Object> health = monitoringService.monitorFinancialHealth();
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            log.error("❌ Erro no monitoramento de saúde: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Monitorar métricas em tempo real
     */
    @GetMapping("/realtime")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> monitorRealTimeMetrics() {
        try {
            log.debug("📊 Monitorando métricas em tempo real");
            Map<String, Object> metrics = monitoringService.monitorRealTimeMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("❌ Erro no monitoramento em tempo real: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Verificar alertas críticos
     */
    @GetMapping("/critical-alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkCriticalAlerts() {
        try {
            log.debug("🚨 Verificando alertas críticos");
            Map<String, Object> alerts = monitoringService.checkCriticalAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("❌ Erro na verificação de alertas críticos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Verificar todos os alertas
     */
    @GetMapping("/all-alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkAllAlerts() {
        try {
            log.debug("🚨 Verificando todos os alertas");
            Map<String, Object> alerts = alertService.checkAllAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("❌ Erro na verificação de todos os alertas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Verificar alertas de receita
     */
    @GetMapping("/revenue-alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkRevenueAlerts() {
        try {
            log.debug("💰 Verificando alertas de receita");
            Map<String, Object> alerts = alertService.checkRevenueAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("❌ Erro na verificação de alertas de receita: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Verificar alertas de transações
     */
    @GetMapping("/transaction-alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkTransactionAlerts() {
        try {
            log.debug("💳 Verificando alertas de transações");
            Map<String, Object> alerts = alertService.checkTransactionAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("❌ Erro na verificação de alertas de transações: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Verificar alertas de pedidos
     */
    @GetMapping("/order-alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkOrderAlerts() {
        try {
            log.debug("📦 Verificando alertas de pedidos");
            Map<String, Object> alerts = alertService.checkOrderAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("❌ Erro na verificação de alertas de pedidos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Verificar alertas de fluxo de caixa
     */
    @GetMapping("/cashflow-alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkCashFlowAlerts() {
        try {
            log.debug("💸 Verificando alertas de fluxo de caixa");
            Map<String, Object> alerts = alertService.checkCashFlowAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("❌ Erro na verificação de alertas de fluxo de caixa: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Configurar alertas personalizados
     */
    @PostMapping("/configure-alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> configureCustomAlerts(@RequestBody Map<String, Object> config) {
        try {
            log.debug("⚙️ Configurando alertas personalizados");
            Map<String, Object> result = alertService.configureCustomAlerts(config);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("❌ Erro na configuração de alertas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Calcular métricas de performance
     */
    @GetMapping("/performance-metrics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> calculatePerformanceMetrics() {
        try {
            log.debug("📈 Calculando métricas de performance");
            Map<String, Object> metrics = metricsService.calculatePerformanceMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("❌ Erro no cálculo de métricas de performance: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Calcular métricas de tendências
     */
    @GetMapping("/trend-metrics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> calculateTrendMetrics() {
        try {
            log.debug("📊 Calculando métricas de tendências");
            Map<String, Object> metrics = metricsService.calculateTrendMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("❌ Erro no cálculo de métricas de tendências: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }

    /**
     * Calcular métricas de previsão
     */
    @GetMapping("/forecast-metrics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> calculateForecastMetrics() {
        try {
            log.debug("🔮 Calculando métricas de previsão");
            Map<String, Object> metrics = metricsService.calculateForecastMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("❌ Erro no cálculo de métricas de previsão: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro interno do servidor"));
        }
    }
}
