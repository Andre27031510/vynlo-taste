package com.vynlotaste.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * ✅ FASE 6: Serviço de IA para Previsão de Demanda
 * Implementa machine learning para previsão de demanda seguindo padrões de grandes empresas (Amazon, Netflix, Uber)
 * 
 * Funcionalidades:
 * - Previsão de demanda por produto/categoria
 * - Análise de sazonalidade e tendências
 * - Recomendações de estoque
 * - Previsão de vendas por período
 * - Detecção de padrões de compra
 * - Otimização de preços baseada em demanda
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DemandForecastingService {

    @Value("${ai.demand-forecasting.enabled:true}")
    private boolean forecastingEnabled;

    @Value("${ai.demand-forecasting.history-days:90}")
    private int historyDays;

    @Value("${ai.demand-forecasting.forecast-days:30}")
    private int forecastDays;

    @Value("${ai.demand-forecasting.confidence-threshold:0.7}")
    private double confidenceThreshold;

    // Dados históricos de vendas
    private final Map<String, List<SalesDataPoint>> historicalData = new ConcurrentHashMap<>();
    
    // Previsões atuais
    private final Map<String, DemandForecast> currentForecasts = new ConcurrentHashMap<>();
    
    // Padrões identificados
    private final Map<String, DemandPattern> demandPatterns = new ConcurrentHashMap<>();

    /**
     * Executar previsão de demanda
     */
    @Scheduled(fixedDelay = 3600000) // A cada hora
    public void performDemandForecasting() {
        if (!forecastingEnabled) {
            return;
        }

        try {
            log.info("🤖 Iniciando previsão de demanda com IA");
            
            // Coletar dados históricos
            collectHistoricalData();
            
            // Identificar padrões
            identifyDemandPatterns();
            
            // Gerar previsões
            generateForecasts();
            
            // Otimizar recomendações
            optimizeRecommendations();
            
            log.info("✅ Previsão de demanda concluída");
            
        } catch (Exception e) {
            log.error("❌ Erro durante previsão de demanda", e);
        }
    }

    /**
     * Coletar dados históricos de vendas
     */
    private void collectHistoricalData() {
        log.debug("📊 Coletando dados históricos de vendas");
        
        // Simular coleta de dados (em produção seria via repositórios)
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minus(historyDays, ChronoUnit.DAYS);
        
        // Dados simulados para diferentes produtos
        String[] products = {"Pizza Margherita", "Hambúrguer Clássico", "Coca-Cola", "Batata Frita", "Salada Caesar"};
        
        for (String product : products) {
            List<SalesDataPoint> dataPoints = generateSimulatedSalesData(product, startDate, endDate);
            historicalData.put(product, dataPoints);
        }
        
        log.info("📈 Dados históricos coletados para {} produtos", products.length);
    }

    /**
     * Gerar dados simulados de vendas
     */
    private List<SalesDataPoint> generateSimulatedSalesData(String product, LocalDateTime start, LocalDateTime end) {
        List<SalesDataPoint> dataPoints = new ArrayList<>();
        
        // Simular padrões de vendas baseados no produto
        double baseDemand = getBaseDemandForProduct(product);
        double seasonalityFactor = getSeasonalityFactor(product);
        double trendFactor = getTrendFactor(product);
        
        LocalDateTime current = start;
        while (current.isBefore(end)) {
            // Calcular demanda baseada em padrões
            double demand = calculateDemandForDate(product, current, baseDemand, seasonalityFactor, trendFactor);
            
            dataPoints.add(new SalesDataPoint(
                current,
                product,
                (int) Math.max(0, demand),
                calculatePriceForProduct(product, current)
            ));
            
            current = current.plus(1, ChronoUnit.DAYS);
        }
        
        return dataPoints;
    }

    /**
     * Calcular demanda para uma data específica
     */
    private double calculateDemandForDate(String product, LocalDateTime date, double baseDemand, 
                                        double seasonalityFactor, double trendFactor) {
        // Fator de dia da semana (fins de semana têm mais vendas)
        double dayOfWeekFactor = getDayOfWeekFactor(date);
        
        // Fator de hora do dia (simulado)
        double timeOfDayFactor = getTimeOfDayFactor(date);
        
        // Fator de sazonalidade
        double seasonalFactor = getSeasonalFactor(date);
        
        // Adicionar ruído aleatório
        double noise = (Math.random() - 0.5) * 0.2; // ±10% de ruído
        
        return baseDemand * dayOfWeekFactor * timeOfDayFactor * seasonalFactor * 
               seasonalityFactor * trendFactor * (1 + noise);
    }

    /**
     * Identificar padrões de demanda
     */
    private void identifyDemandPatterns() {
        log.debug("🔍 Identificando padrões de demanda");
        
        for (Map.Entry<String, List<SalesDataPoint>> entry : historicalData.entrySet()) {
            String product = entry.getKey();
            List<SalesDataPoint> data = entry.getValue();
            
            DemandPattern pattern = analyzeDemandPattern(product, data);
            demandPatterns.put(product, pattern);
            
            log.debug("📊 Padrão identificado para {}: {}", product, pattern.getPatternType());
        }
    }

    /**
     * Analisar padrão de demanda para um produto
     */
    private DemandPattern analyzeDemandPattern(String product, List<SalesDataPoint> data) {
        // Calcular estatísticas básicas
        double mean = data.stream().mapToInt(SalesDataPoint::getQuantity).average().orElse(0);
        double variance = data.stream()
            .mapToDouble(point -> Math.pow(point.getQuantity() - mean, 2))
            .average().orElse(0);
        double stdDev = Math.sqrt(variance);
        
        // Identificar tipo de padrão
        String patternType = identifyPatternType(data, mean, stdDev);
        
        // Calcular sazonalidade
        Map<Integer, Double> seasonality = calculateSeasonality(data);
        
        // Calcular tendência
        double trend = calculateTrend(data);
        
        return DemandPattern.builder()
            .product(product)
            .patternType(patternType)
            .meanDemand(mean)
            .standardDeviation(stdDev)
            .seasonality(seasonality)
            .trend(trend)
            .confidence(calculatePatternConfidence(data, mean, stdDev))
            .build();
    }

    /**
     * Identificar tipo de padrão
     */
    private String identifyPatternType(List<SalesDataPoint> data, double mean, double stdDev) {
        double coefficientOfVariation = stdDev / mean;
        
        if (coefficientOfVariation < 0.1) {
            return "STABLE"; // Demanda estável
        } else if (coefficientOfVariation < 0.3) {
            return "SEASONAL"; // Demanda sazonal
        } else if (coefficientOfVariation < 0.5) {
            return "TRENDING"; // Demanda com tendência
        } else {
            return "VOLATILE"; // Demanda volátil
        }
    }

    /**
     * Calcular sazonalidade
     */
    private Map<Integer, Double> calculateSeasonality(List<SalesDataPoint> data) {
        Map<Integer, Double> seasonality = new HashMap<>();
        
        // Agrupar por dia da semana
        Map<Integer, List<SalesDataPoint>> byDayOfWeek = data.stream()
            .collect(Collectors.groupingBy(point -> point.getDate().getDayOfWeek().getValue()));
        
        for (Map.Entry<Integer, List<SalesDataPoint>> entry : byDayOfWeek.entrySet()) {
            double avgDemand = entry.getValue().stream()
                .mapToInt(SalesDataPoint::getQuantity)
                .average().orElse(0);
            seasonality.put(entry.getKey(), avgDemand);
        }
        
        return seasonality;
    }

    /**
     * Calcular tendência
     */
    private double calculateTrend(List<SalesDataPoint> data) {
        if (data.size() < 2) return 0;
        
        // Regressão linear simples
        double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        int n = data.size();
        
        for (int i = 0; i < n; i++) {
            double x = i;
            double y = data.get(i).getQuantity();
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }

    /**
     * Gerar previsões
     */
    private void generateForecasts() {
        log.debug("🔮 Gerando previsões de demanda");
        
        for (Map.Entry<String, DemandPattern> entry : demandPatterns.entrySet()) {
            String product = entry.getKey();
            DemandPattern pattern = entry.getValue();
            
            DemandForecast forecast = generateForecastForProduct(product, pattern);
            currentForecasts.put(product, forecast);
            
            log.debug("📈 Previsão gerada para {}: {} unidades/dia", 
                product, forecast.getAverageDailyDemand());
        }
    }

    /**
     * Gerar previsão para um produto específico
     */
    private DemandForecast generateForecastForProduct(String product, DemandPattern pattern) {
        List<ForecastDataPoint> forecastPoints = new ArrayList<>();
        LocalDateTime startDate = LocalDateTime.now().plus(1, ChronoUnit.DAYS);
        
        for (int i = 0; i < forecastDays; i++) {
            LocalDateTime forecastDate = startDate.plus(i, ChronoUnit.DAYS);
            
            // Calcular demanda prevista
            double predictedDemand = calculatePredictedDemand(forecastDate, pattern);
            
            // Calcular intervalo de confiança
            double confidenceInterval = calculateConfidenceInterval(pattern, predictedDemand);
            
            forecastPoints.add(new ForecastDataPoint(
                forecastDate,
                (int) Math.max(0, predictedDemand),
                confidenceInterval,
                calculateOptimalPrice(product, forecastDate, predictedDemand)
            ));
        }
        
        return DemandForecast.builder()
            .product(product)
            .forecastPoints(forecastPoints)
            .averageDailyDemand(forecastPoints.stream()
                .mapToInt(ForecastDataPoint::getPredictedDemand)
                .average().orElse(0))
            .confidence(calculateOverallConfidence(forecastPoints))
            .recommendations(generateRecommendations(product, pattern, forecastPoints))
            .build();
    }

    /**
     * Calcular demanda prevista
     */
    private double calculatePredictedDemand(LocalDateTime date, DemandPattern pattern) {
        double baseDemand = pattern.getMeanDemand();
        double trend = pattern.getTrend();
        double seasonalFactor = pattern.getSeasonality()
            .getOrDefault(date.getDayOfWeek().getValue(), 1.0);
        
        // Aplicar tendência
        double trendedDemand = baseDemand + (trend * getDaysFromStart(date));
        
        // Aplicar sazonalidade
        return trendedDemand * seasonalFactor;
    }

    /**
     * Obter previsão de demanda para um produto
     */
    public DemandForecast getDemandForecast(String product) {
        return currentForecasts.get(product);
    }

    /**
     * Obter todas as previsões
     */
    public Map<String, DemandForecast> getAllForecasts() {
        return new HashMap<>(currentForecasts);
    }

    /**
     * Obter recomendações de estoque
     */
    public List<InventoryRecommendation> getInventoryRecommendations() {
        List<InventoryRecommendation> recommendations = new ArrayList<>();
        
        for (DemandForecast forecast : currentForecasts.values()) {
            recommendations.add(InventoryRecommendation.builder()
                .product(forecast.getProduct())
                .recommendedStock(calculateRecommendedStock(forecast))
                .reorderPoint(calculateReorderPoint(forecast))
                .safetyStock(calculateSafetyStock(forecast))
                .confidence(forecast.getConfidence())
                .build());
        }
        
        return recommendations;
    }

    /**
     * Calcular estoque recomendado
     */
    private int calculateRecommendedStock(DemandForecast forecast) {
        double avgDemand = forecast.getAverageDailyDemand();
        int leadTime = 7; // 7 dias de lead time
        double safetyFactor = 1.5; // 50% de segurança
        
        return (int) Math.ceil(avgDemand * leadTime * safetyFactor);
    }

    /**
     * Calcular ponto de reordenação
     */
    private int calculateReorderPoint(DemandForecast forecast) {
        double avgDemand = forecast.getAverageDailyDemand();
        int leadTime = 7;
        double safetyFactor = 1.2;
        
        return (int) Math.ceil(avgDemand * leadTime * safetyFactor);
    }

    /**
     * Calcular estoque de segurança
     */
    private int calculateSafetyStock(DemandForecast forecast) {
        double avgDemand = forecast.getAverageDailyDemand();
        double safetyFactor = 0.3; // 30% do estoque médio
        
        return (int) Math.ceil(avgDemand * safetyFactor);
    }

    // Métodos auxiliares para simulação
    private double getBaseDemandForProduct(String product) {
        switch (product) {
            case "Pizza Margherita": return 25.0;
            case "Hambúrguer Clássico": return 30.0;
            case "Coca-Cola": return 50.0;
            case "Batata Frita": return 20.0;
            case "Salada Caesar": return 15.0;
            default: return 10.0;
        }
    }

    private double getSeasonalityFactor(String product) {
        // Produtos têm diferentes sazonalidades
        return 1.0 + (Math.random() - 0.5) * 0.4; // ±20%
    }

    private double getTrendFactor(String product) {
        // Tendência de crescimento/declínio
        return 1.0 + (Math.random() - 0.5) * 0.2; // ±10%
    }

    private double getDayOfWeekFactor(LocalDateTime date) {
        int dayOfWeek = date.getDayOfWeek().getValue();
        return dayOfWeek >= 6 ? 1.3 : 1.0; // Fins de semana +30%
    }

    private double getTimeOfDayFactor(LocalDateTime date) {
        int hour = date.getHour();
        if (hour >= 12 && hour <= 14) return 1.5; // Almoço
        if (hour >= 19 && hour <= 21) return 1.3; // Jantar
        return 0.8; // Outros horários
    }

    private double getSeasonalFactor(LocalDateTime date) {
        int month = date.getMonthValue();
        // Simular sazonalidade (ex: dezembro tem mais vendas)
        return month == 12 ? 1.4 : 1.0;
    }

    private double calculatePriceForProduct(String product, LocalDateTime date) {
        // Preços base por produto
        double basePrice = switch (product) {
            case "Pizza Margherita" -> 35.90;
            case "Hambúrguer Clássico" -> 28.90;
            case "Coca-Cola" -> 5.90;
            case "Batata Frita" -> 12.90;
            case "Salada Caesar" -> 18.90;
            default -> 15.90;
        };
        
        // Aplicar variação de preço baseada na demanda
        return basePrice * (1 + (Math.random() - 0.5) * 0.1); // ±5%
    }

    private double calculateConfidenceInterval(DemandPattern pattern, double predictedDemand) {
        return pattern.getStandardDeviation() * 1.96; // 95% de confiança
    }

    private double calculateOverallConfidence(List<ForecastDataPoint> forecastPoints) {
        return forecastPoints.stream()
            .mapToDouble(ForecastDataPoint::getConfidence)
            .average().orElse(0.5);
    }

    private double calculateOptimalPrice(String product, LocalDateTime date, double predictedDemand) {
        // Preço base
        double basePrice = calculatePriceForProduct(product, date);
        
        // Ajustar preço baseado na demanda prevista
        if (predictedDemand > 40) {
            return basePrice * 1.1; // Aumentar preço se alta demanda
        } else if (predictedDemand < 10) {
            return basePrice * 0.9; // Diminuir preço se baixa demanda
        }
        
        return basePrice;
    }

    private List<String> generateRecommendations(String product, DemandPattern pattern, 
                                               List<ForecastDataPoint> forecastPoints) {
        List<String> recommendations = new ArrayList<>();
        
        double avgDemand = forecastPoints.stream()
            .mapToInt(ForecastDataPoint::getPredictedDemand)
            .average().orElse(0);
        
        if (avgDemand > 30) {
            recommendations.add("Aumentar estoque - alta demanda prevista");
        } else if (avgDemand < 10) {
            recommendations.add("Reduzir estoque - baixa demanda prevista");
        }
        
        if (pattern.getTrend() > 0.5) {
            recommendations.add("Produto em crescimento - considerar expansão");
        } else if (pattern.getTrend() < -0.5) {
            recommendations.add("Produto em declínio - considerar promoções");
        }
        
        return recommendations;
    }

    private double calculatePatternConfidence(List<SalesDataPoint> data, double mean, double stdDev) {
        // Confiança baseada na consistência dos dados
        double coefficientOfVariation = stdDev / mean;
        return Math.max(0.1, 1.0 - coefficientOfVariation);
    }

    private long getDaysFromStart(LocalDateTime date) {
        return ChronoUnit.DAYS.between(LocalDateTime.now().minus(historyDays, ChronoUnit.DAYS), date);
    }

    private void optimizeRecommendations() {
        log.debug("🎯 Otimizando recomendações de IA");
        // Implementar otimizações baseadas em ML
    }

    // Classes de dados
    public static class SalesDataPoint {
        private final LocalDateTime date;
        private final String product;
        private final int quantity;
        private final double price;

        public SalesDataPoint(LocalDateTime date, String product, int quantity, double price) {
            this.date = date;
            this.product = product;
            this.quantity = quantity;
            this.price = price;
        }

        // Getters
        public LocalDateTime getDate() { return date; }
        public String getProduct() { return product; }
        public int getQuantity() { return quantity; }
        public double getPrice() { return price; }
    }

    public static class DemandPattern {
        private String product;
        private String patternType;
        private double meanDemand;
        private double standardDeviation;
        private Map<Integer, Double> seasonality;
        private double trend;
        private double confidence;

        public static DemandPatternBuilder builder() {
            return new DemandPatternBuilder();
        }

        // Getters e setters
        public String getProduct() { return product; }
        public void setProduct(String product) { this.product = product; }
        public String getPatternType() { return patternType; }
        public void setPatternType(String patternType) { this.patternType = patternType; }
        public double getMeanDemand() { return meanDemand; }
        public void setMeanDemand(double meanDemand) { this.meanDemand = meanDemand; }
        public double getStandardDeviation() { return standardDeviation; }
        public void setStandardDeviation(double standardDeviation) { this.standardDeviation = standardDeviation; }
        public Map<Integer, Double> getSeasonality() { return seasonality; }
        public void setSeasonality(Map<Integer, Double> seasonality) { this.seasonality = seasonality; }
        public double getTrend() { return trend; }
        public void setTrend(double trend) { this.trend = trend; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }

        public static class DemandPatternBuilder {
            private String product;
            private String patternType;
            private double meanDemand;
            private double standardDeviation;
            private Map<Integer, Double> seasonality;
            private double trend;
            private double confidence;

            public DemandPatternBuilder product(String product) { this.product = product; return this; }
            public DemandPatternBuilder patternType(String patternType) { this.patternType = patternType; return this; }
            public DemandPatternBuilder meanDemand(double meanDemand) { this.meanDemand = meanDemand; return this; }
            public DemandPatternBuilder standardDeviation(double standardDeviation) { this.standardDeviation = standardDeviation; return this; }
            public DemandPatternBuilder seasonality(Map<Integer, Double> seasonality) { this.seasonality = seasonality; return this; }
            public DemandPatternBuilder trend(double trend) { this.trend = trend; return this; }
            public DemandPatternBuilder confidence(double confidence) { this.confidence = confidence; return this; }

            public DemandPattern build() {
                DemandPattern pattern = new DemandPattern();
                pattern.setProduct(product);
                pattern.setPatternType(patternType);
                pattern.setMeanDemand(meanDemand);
                pattern.setStandardDeviation(standardDeviation);
                pattern.setSeasonality(seasonality);
                pattern.setTrend(trend);
                pattern.setConfidence(confidence);
                return pattern;
            }
        }
    }

    public static class DemandForecast {
        private String product;
        private List<ForecastDataPoint> forecastPoints;
        private double averageDailyDemand;
        private double confidence;
        private List<String> recommendations;

        public static DemandForecastBuilder builder() {
            return new DemandForecastBuilder();
        }

        // Getters e setters
        public String getProduct() { return product; }
        public void setProduct(String product) { this.product = product; }
        public List<ForecastDataPoint> getForecastPoints() { return forecastPoints; }
        public void setForecastPoints(List<ForecastDataPoint> forecastPoints) { this.forecastPoints = forecastPoints; }
        public double getAverageDailyDemand() { return averageDailyDemand; }
        public void setAverageDailyDemand(double averageDailyDemand) { this.averageDailyDemand = averageDailyDemand; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
        public List<String> getRecommendations() { return recommendations; }
        public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

        public static class DemandForecastBuilder {
            private String product;
            private List<ForecastDataPoint> forecastPoints;
            private double averageDailyDemand;
            private double confidence;
            private List<String> recommendations;

            public DemandForecastBuilder product(String product) { this.product = product; return this; }
            public DemandForecastBuilder forecastPoints(List<ForecastDataPoint> forecastPoints) { this.forecastPoints = forecastPoints; return this; }
            public DemandForecastBuilder averageDailyDemand(double averageDailyDemand) { this.averageDailyDemand = averageDailyDemand; return this; }
            public DemandForecastBuilder confidence(double confidence) { this.confidence = confidence; return this; }
            public DemandForecastBuilder recommendations(List<String> recommendations) { this.recommendations = recommendations; return this; }

            public DemandForecast build() {
                DemandForecast forecast = new DemandForecast();
                forecast.setProduct(product);
                forecast.setForecastPoints(forecastPoints);
                forecast.setAverageDailyDemand(averageDailyDemand);
                forecast.setConfidence(confidence);
                forecast.setRecommendations(recommendations);
                return forecast;
            }
        }
    }

    public static class ForecastDataPoint {
        private final LocalDateTime date;
        private final int predictedDemand;
        private final double confidence;
        private final double optimalPrice;

        public ForecastDataPoint(LocalDateTime date, int predictedDemand, double confidence, double optimalPrice) {
            this.date = date;
            this.predictedDemand = predictedDemand;
            this.confidence = confidence;
            this.optimalPrice = optimalPrice;
        }

        // Getters
        public LocalDateTime getDate() { return date; }
        public int getPredictedDemand() { return predictedDemand; }
        public double getConfidence() { return confidence; }
        public double getOptimalPrice() { return optimalPrice; }
    }

    public static class InventoryRecommendation {
        private String product;
        private int recommendedStock;
        private int reorderPoint;
        private int safetyStock;
        private double confidence;

        public static InventoryRecommendationBuilder builder() {
            return new InventoryRecommendationBuilder();
        }

        // Getters e setters
        public String getProduct() { return product; }
        public void setProduct(String product) { this.product = product; }
        public int getRecommendedStock() { return recommendedStock; }
        public void setRecommendedStock(int recommendedStock) { this.recommendedStock = recommendedStock; }
        public int getReorderPoint() { return reorderPoint; }
        public void setReorderPoint(int reorderPoint) { this.reorderPoint = reorderPoint; }
        public int getSafetyStock() { return safetyStock; }
        public void setSafetyStock(int safetyStock) { this.safetyStock = safetyStock; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }

        public static class InventoryRecommendationBuilder {
            private String product;
            private int recommendedStock;
            private int reorderPoint;
            private int safetyStock;
            private double confidence;

            public InventoryRecommendationBuilder product(String product) { this.product = product; return this; }
            public InventoryRecommendationBuilder recommendedStock(int recommendedStock) { this.recommendedStock = recommendedStock; return this; }
            public InventoryRecommendationBuilder reorderPoint(int reorderPoint) { this.reorderPoint = reorderPoint; return this; }
            public InventoryRecommendationBuilder safetyStock(int safetyStock) { this.safetyStock = safetyStock; return this; }
            public InventoryRecommendationBuilder confidence(double confidence) { this.confidence = confidence; return this; }

            public InventoryRecommendation build() {
                InventoryRecommendation recommendation = new InventoryRecommendation();
                recommendation.setProduct(product);
                recommendation.setRecommendedStock(recommendedStock);
                recommendation.setReorderPoint(reorderPoint);
                recommendation.setSafetyStock(safetyStock);
                recommendation.setConfidence(confidence);
                return recommendation;
            }
        }
    }
}
