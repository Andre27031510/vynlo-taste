package com.vynlotaste.controller.church;
// touch: redeploy note (commit 112b089, d96f8ca, ce2d2e6) - comentário leve sem impacto funcional

import com.vynlotaste.repository.church.TithingRepository;
import com.vynlotaste.repository.church.ExpenseRepository;
import com.vynlotaste.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Map;

/**
 * Controller para FinancialReport - EKKLESIA
 * Fase 1: Rota corrigida - removido /api do @RequestMapping (context-path=/api)
 * Rota final: /api/v1/ekklesia/financial-report
 */
@RestController
@RequestMapping("/v1/ekklesia/financial-report")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class FinancialReportController {

    private final TithingRepository tithingRepository;
    private final ExpenseRepository expenseRepository;

    /**
     * GET /api/v1/ekklesia/financial-report/summary?month=2025-10
     * month no formato yyyy-MM
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null && !TenantContext.isSuperAdmin()) {
            return ResponseEntity.ok(Map.of(
                "cash", BigDecimal.ZERO,
                "pixCard", BigDecimal.ZERO,
                "general", BigDecimal.ZERO,
                "expenses", BigDecimal.ZERO
            ));
        }

        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        // Entradas - por simplicidade, considerar tudo como "general"
        BigDecimal totalEntries = tithingRepository.sumByTenantIdAndPaymentDateBetween(tenantId, start, end);
        if (totalEntries == null) totalEntries = BigDecimal.ZERO;

        // Saídas
        BigDecimal totalExpenses = expenseRepository.sumByTenantAndPeriod(tenantId, start, end);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        return ResponseEntity.ok(Map.of(
            "cash", BigDecimal.ZERO, // Placeholder até categorizar meios de pagamento
            "pixCard", BigDecimal.ZERO,
            "general", totalEntries,
            "expenses", totalExpenses
        ));
    }
}


