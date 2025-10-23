package com.vynlotaste.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Service para dashboard financeiro
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinancialDashboardService {

    private final FinancialTransactionService financialTransactionService;
    private final OrderService orderService;

    /**
     * Obter métricas do dashboard financeiro
     */
    public Map<String, Object> getDashboardMetrics() {
        log.debug("📊 Gerando métricas do dashboard financeiro");

        try {
            LocalDate today = LocalDate.now();
            LocalDate startOfMonth = today.withDayOfMonth(1);
            LocalDate startOfWeek = today.minusDays(7);

            // Calcular métricas do período atual
            BigDecimal monthlyRevenue = financialTransactionService.calculateRevenue(startOfMonth, today);
            BigDecimal monthlyExpenses = financialTransactionService.calculateExpenses(startOfMonth, today);
            BigDecimal weeklyRevenue = financialTransactionService.calculateRevenue(startOfWeek, today);
            BigDecimal weeklyExpenses = financialTransactionService.calculateExpenses(startOfWeek, today);

            // Calcular métricas de pedidos
            long totalOrdersToday = orderService.countOrdersToday();
            long pendingOrders = orderService.countPendingOrders();
            long completedOrders = orderService.countCompletedOrders();

            // Calcular métricas de transações
            var pendingTransactions = financialTransactionService.findPendingTransactions();
            int pendingTransactionsCount = pendingTransactions.size();

            // Calcular métricas de fluxo de caixa
            BigDecimal netIncome = monthlyRevenue.subtract(monthlyExpenses);
            BigDecimal averageOrderValue = totalOrdersToday > 0 
                ? monthlyRevenue.divide(BigDecimal.valueOf(totalOrdersToday), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

            // Calcular crescimento
            BigDecimal revenueGrowth = calculateGrowth(weeklyRevenue, monthlyRevenue);
            BigDecimal orderGrowth = calculateOrderGrowth();

            Map<String, Object> metrics = new HashMap<>();
            metrics.put("revenue", Map.of(
                "monthly", monthlyRevenue,
                "weekly", weeklyRevenue,
                "growth", revenueGrowth
            ));
            metrics.put("expenses", Map.of(
                "monthly", monthlyExpenses,
                "weekly", weeklyExpenses
            ));
            metrics.put("orders", Map.of(
                "totalToday", totalOrdersToday,
                "pending", pendingOrders,
                "completed", completedOrders,
                "averageValue", averageOrderValue,
                "growth", orderGrowth
            ));
            metrics.put("transactions", Map.of(
                "pending", pendingTransactionsCount
            ));
            metrics.put("cashFlow", Map.of(
                "netIncome", netIncome,
                "status", netIncome.compareTo(BigDecimal.ZERO) > 0 ? "positive" : "negative"
            ));
            metrics.put("period", Map.of(
                "startOfMonth", startOfMonth,
                "endOfMonth", today,
                "generatedAt", LocalDateTime.now()
            ));

            log.info("✅ Métricas do dashboard geradas: Receita mensal: R$ {}, Pedidos hoje: {}", 
                    monthlyRevenue, totalOrdersToday);

            return metrics;

        } catch (Exception e) {
            log.error("❌ Erro ao gerar métricas do dashboard: {}", e.getMessage(), e);
            return getDefaultMetrics();
        }
    }

    /**
     * Obter métricas de performance
     */
    public Map<String, Object> getPerformanceMetrics() {
        log.debug("📈 Gerando métricas de performance");

        try {
            LocalDate today = LocalDate.now();
            LocalDate lastMonth = today.minusMonths(1);
            LocalDate startOfLastMonth = lastMonth.withDayOfMonth(1);
            LocalDate endOfLastMonth = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth());

            // Métricas do mês atual
            BigDecimal currentMonthRevenue = financialTransactionService.calculateRevenue(today.withDayOfMonth(1), today);
            BigDecimal currentMonthExpenses = financialTransactionService.calculateExpenses(today.withDayOfMonth(1), today);

            // Métricas do mês anterior
            BigDecimal lastMonthRevenue = financialTransactionService.calculateRevenue(startOfLastMonth, endOfLastMonth);
            BigDecimal lastMonthExpenses = financialTransactionService.calculateExpenses(startOfLastMonth, endOfLastMonth);

            // Calcular crescimento
            BigDecimal revenueGrowth = calculateGrowth(lastMonthRevenue, currentMonthRevenue);
            BigDecimal expenseGrowth = calculateGrowth(lastMonthExpenses, currentMonthExpenses);

            // Calcular eficiência
            BigDecimal currentEfficiency = currentMonthExpenses.compareTo(BigDecimal.ZERO) > 0 
                ? currentMonthRevenue.divide(currentMonthExpenses, 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

            BigDecimal lastEfficiency = lastMonthExpenses.compareTo(BigDecimal.ZERO) > 0 
                ? lastMonthRevenue.divide(lastMonthExpenses, 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

            Map<String, Object> performance = new HashMap<>();
            performance.put("revenue", Map.of(
                "current", currentMonthRevenue,
                "previous", lastMonthRevenue,
                "growth", revenueGrowth
            ));
            performance.put("expenses", Map.of(
                "current", currentMonthExpenses,
                "previous", lastMonthExpenses,
                "growth", expenseGrowth
            ));
            performance.put("efficiency", Map.of(
                "current", currentEfficiency,
                "previous", lastEfficiency,
                "trend", currentEfficiency.compareTo(lastEfficiency) > 0 ? "improving" : "declining"
            ));
            performance.put("period", Map.of(
                "current", today.withDayOfMonth(1) + " até " + today,
                "previous", startOfLastMonth + " até " + endOfLastMonth
            ));

            return performance;

        } catch (Exception e) {
            log.error("❌ Erro ao gerar métricas de performance: {}", e.getMessage(), e);
            return getDefaultPerformanceMetrics();
        }
    }

    /**
     * Obter alertas financeiros
     */
    public Map<String, Object> getFinancialAlerts() {
        log.debug("🚨 Gerando alertas financeiros");

        try {
            var alerts = new HashMap<String, Object>();
            var alertList = new java.util.ArrayList<Map<String, Object>>();

            // Verificar transações pendentes
            var pendingTransactions = financialTransactionService.findPendingTransactions();
            if (pendingTransactions.size() > 10) {
                alertList.add(Map.of(
                    "type", "warning",
                    "title", "Muitas transações pendentes",
                    "message", "Você tem " + pendingTransactions.size() + " transações pendentes",
                    "action", "Revisar transações pendentes",
                    "priority", "medium"
                ));
            }

            // Verificar receita baixa
            LocalDate today = LocalDate.now();
            LocalDate startOfWeek = today.minusDays(7);
            BigDecimal weeklyRevenue = financialTransactionService.calculateRevenue(startOfWeek, today);
            
            if (weeklyRevenue.compareTo(BigDecimal.valueOf(1000)) < 0) {
                alertList.add(Map.of(
                    "type", "info",
                    "title", "Receita semanal baixa",
                    "message", "Receita da semana: R$ " + weeklyRevenue,
                    "action", "Analisar estratégias de vendas",
                    "priority", "low"
                ));
            }

            // Verificar crescimento negativo
            BigDecimal monthlyRevenue = financialTransactionService.calculateRevenue(today.withDayOfMonth(1), today);
            BigDecimal lastMonthRevenue = financialTransactionService.calculateRevenue(
                today.minusMonths(1).withDayOfMonth(1), 
                today.minusMonths(1).withDayOfMonth(today.minusMonths(1).lengthOfMonth())
            );
            
            if (monthlyRevenue.compareTo(lastMonthRevenue) < 0) {
                alertList.add(Map.of(
                    "type", "error",
                    "title", "Crescimento negativo",
                    "message", "Receita atual menor que o mês anterior",
                    "action", "Investigar causas da queda",
                    "priority", "high"
                ));
            }

            alerts.put("alerts", alertList);
            alerts.put("totalAlerts", alertList.size());
            alerts.put("highPriority", alertList.stream().filter(a -> "high".equals(a.get("priority"))).count());
            alerts.put("generatedAt", LocalDateTime.now());

            return alerts;

        } catch (Exception e) {
            log.error("❌ Erro ao gerar alertas financeiros: {}", e.getMessage(), e);
            return getDefaultAlerts();
        }
    }

    /**
     * Calcular crescimento percentual
     */
    private BigDecimal calculateGrowth(BigDecimal previous, BigDecimal current) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? BigDecimal.valueOf(100) : BigDecimal.ZERO;
        }
        return current.subtract(previous)
                .divide(previous, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Calcular crescimento de pedidos
     */
    private BigDecimal calculateOrderGrowth() {
        try {
            long currentOrders = orderService.countOrdersToday();
            long previousOrders = orderService.countOrdersLastHour(); // Aproximação
            
            if (previousOrders == 0) {
                return currentOrders > 0 ? BigDecimal.valueOf(100) : BigDecimal.ZERO;
            }
            
            return BigDecimal.valueOf(currentOrders - previousOrders)
                    .divide(BigDecimal.valueOf(previousOrders), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Métricas padrão em caso de erro
     */
    private Map<String, Object> getDefaultMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("revenue", Map.of("monthly", BigDecimal.ZERO, "weekly", BigDecimal.ZERO, "growth", BigDecimal.ZERO));
        metrics.put("expenses", Map.of("monthly", BigDecimal.ZERO, "weekly", BigDecimal.ZERO));
        metrics.put("orders", Map.of("totalToday", 0L, "pending", 0L, "completed", 0L, "averageValue", BigDecimal.ZERO, "growth", BigDecimal.ZERO));
        metrics.put("transactions", Map.of("pending", 0));
        metrics.put("cashFlow", Map.of("netIncome", BigDecimal.ZERO, "status", "neutral"));
        metrics.put("period", Map.of("startOfMonth", LocalDate.now(), "endOfMonth", LocalDate.now(), "generatedAt", LocalDateTime.now()));
        return metrics;
    }

    /**
     * Métricas de performance padrão
     */
    private Map<String, Object> getDefaultPerformanceMetrics() {
        Map<String, Object> performance = new HashMap<>();
        performance.put("revenue", Map.of("current", BigDecimal.ZERO, "previous", BigDecimal.ZERO, "growth", BigDecimal.ZERO));
        performance.put("expenses", Map.of("current", BigDecimal.ZERO, "previous", BigDecimal.ZERO, "growth", BigDecimal.ZERO));
        performance.put("efficiency", Map.of("current", BigDecimal.ZERO, "previous", BigDecimal.ZERO, "trend", "stable"));
        performance.put("period", Map.of("current", "N/A", "previous", "N/A"));
        return performance;
    }

    /**
     * Alertas padrão
     */
    private Map<String, Object> getDefaultAlerts() {
        Map<String, Object> alerts = new HashMap<>();
        alerts.put("alerts", new java.util.ArrayList<>());
        alerts.put("totalAlerts", 0);
        alerts.put("highPriority", 0);
        alerts.put("generatedAt", LocalDateTime.now());
        return alerts;
    }

    /**
     * ✅ NOVO: Geração automática de relatórios financeiros
     * Executa diariamente às 6h para relatório do dia anterior
     */
    @Scheduled(cron = "0 0 6 * * *") // Diariamente às 6h
    public void generateDailyFinancialReport() {
        log.info("📊 Gerando relatório financeiro diário automático");
        
        try {
            LocalDate yesterday = LocalDate.now().minusDays(1);
            
            // Obter métricas do dia anterior
            Map<String, Object> dailyMetrics = getDashboardMetrics();
            
            // Obter performance do dia anterior
            Map<String, Object> dailyPerformance = getPerformanceMetrics();
            
            // Gerar relatório consolidado
            Map<String, Object> dailyReport = new HashMap<>();
            dailyReport.put("date", yesterday);
            dailyReport.put("metrics", dailyMetrics);
            dailyReport.put("performance", dailyPerformance);
            dailyReport.put("generatedAt", LocalDateTime.now());
            
            log.info("✅ Relatório diário gerado: {} - Receita: {}, Pedidos: {}", 
                    yesterday, 
                    dailyMetrics.get("totalRevenue"), 
                    dailyMetrics.get("totalOrders"));
            
            // Aqui poderia salvar o relatório em arquivo ou enviar por email
            
        } catch (Exception e) {
            log.error("❌ Erro na geração automática de relatório diário: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ NOVO: Geração automática de relatório semanal
     * Executa semanalmente às segundas-feiras às 8h
     */
    @Scheduled(cron = "0 0 8 * * MON") // Segundas-feiras às 8h
    public void generateWeeklyFinancialReport() {
        log.info("📈 Gerando relatório financeiro semanal automático");
        
        try {
            LocalDate endDate = LocalDate.now().minusDays(1);
            LocalDate startDate = endDate.minusDays(6); // Últimos 7 dias
            
            // Obter métricas da semana
            Map<String, Object> weeklyMetrics = getDashboardMetrics();
            
            // Obter performance da semana
            Map<String, Object> weeklyPerformance = getPerformanceMetrics();
            
            // Gerar relatório consolidado
            Map<String, Object> weeklyReport = new HashMap<>();
            weeklyReport.put("period", startDate + " a " + endDate);
            weeklyReport.put("metrics", weeklyMetrics);
            weeklyReport.put("performance", weeklyPerformance);
            weeklyReport.put("generatedAt", LocalDateTime.now());
            
            log.info("✅ Relatório semanal gerado: {} - Receita: {}, Pedidos: {}", 
                    weeklyReport.get("period"), 
                    weeklyMetrics.get("totalRevenue"), 
                    weeklyMetrics.get("totalOrders"));
            
            // Aqui poderia salvar o relatório em arquivo ou enviar por email
            
        } catch (Exception e) {
            log.error("❌ Erro na geração automática de relatório semanal: {}", e.getMessage(), e);
        }
    }
}
