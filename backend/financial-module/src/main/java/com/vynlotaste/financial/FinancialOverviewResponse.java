package com.vynlotaste.financial;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class FinancialOverviewResponse {
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private String periodType;
    private String currency;
    private LocalDate lastUpdated;
    private String generatedBy;
    
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netIncome;
    private BigDecimal grossProfit;
    private BigDecimal profitMargin;
    
    private List<AccountBalance> accountBalances;
    private BigDecimal totalCashBalance;
    private BigDecimal totalBankBalance;
    private BigDecimal totalCreditBalance;
    
    private List<RevenueCategory> revenueCategories;
    private BigDecimal averageOrderValue;
    private Integer totalOrders;
    private BigDecimal deliveryRevenue;
    private BigDecimal dineInRevenue;
    
    private List<ExpenseCategory> expenseCategories;
    private BigDecimal foodCosts;
    private BigDecimal laborCosts;
    private BigDecimal operationalCosts;
    private BigDecimal marketingCosts;
    
    private BigDecimal cashFlow;
    private BigDecimal workingCapital;
    private BigDecimal debtToEquity;
    private BigDecimal returnOnInvestment;
    
    private List<DailyTrend> dailyTrends;
    private List<WeeklyTrend> weeklyTrends;
    private List<MonthlyTrend> monthlyTrends;
    
    private List<FinancialAlert> alerts;
    private List<UpcomingPayment> upcomingPayments;
    private List<OverduePayment> overduePayments;

    @Data
    public static class AccountBalance {
        private Long accountId;
        private String accountName;
        private String accountType;
        private BigDecimal currentBalance;
        private BigDecimal availableBalance;
        private String status;
        private String currency;
    }

    @Data
    public static class RevenueCategory {
        private String category;
        private BigDecimal amount;
        private BigDecimal percentage;
        private Integer transactionCount;
        private BigDecimal previousPeriodAmount;
        private BigDecimal growthPercentage;
    }

    @Data
    public static class ExpenseCategory {
        private String category;
        private BigDecimal amount;
        private BigDecimal percentage;
        private Integer transactionCount;
        private BigDecimal previousPeriodAmount;
        private BigDecimal growthPercentage;
        private String trend;
    }

    @Data
    public static class DailyTrend {
        private LocalDate date;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal netIncome;
        private Integer orderCount;
        private BigDecimal averageOrderValue;
    }

    @Data
    public static class WeeklyTrend {
        private String weekOfYear;
        private LocalDate weekStart;
        private LocalDate weekEnd;
        private BigDecimal totalRevenue;
        private BigDecimal totalExpenses;
        private BigDecimal netIncome;
        private Integer totalOrders;
        private BigDecimal averageOrderValue;
    }

    @Data
    public static class MonthlyTrend {
        private String month;
        private Integer year;
        private BigDecimal totalRevenue;
        private BigDecimal totalExpenses;
        private BigDecimal netIncome;
        private Integer totalOrders;
        private BigDecimal averageOrderValue;
        private BigDecimal profitMargin;
    }

    @Data
    public static class FinancialAlert {
        private String type;
        private String severity;
        private String message;
        private String accountName;
        private BigDecimal amount;
        private String actionRequired;
    }

    @Data
    public static class UpcomingPayment {
        private Long transactionId;
        private String description;
        private BigDecimal amount;
        private LocalDate dueDate;
        private String accountName;
        private String category;
        private String status;
        private Integer daysUntilDue;
    }

    @Data
    public static class OverduePayment {
        private Long transactionId;
        private String description;
        private BigDecimal amount;
        private LocalDate dueDate;
        private String accountName;
        private String category;
        private Integer daysOverdue;
    }
}