package com.vynlotaste.controller;

import com.vynlotaste.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductStatsController {

    private final ProductService productService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        ProductService.ProductStats stats = productService.getProductStats();
        
        Map<String, Object> response = Map.of(
            "totalProducts", stats.getTotalProducts(),
            "activeProducts", stats.getActiveProducts(),
            "lowStockProducts", stats.getLowStockProducts(),
            "totalRevenue", 18750.50,
            "averagePrice", 26.47
        );
        
        return ResponseEntity.ok(response);
    }
}