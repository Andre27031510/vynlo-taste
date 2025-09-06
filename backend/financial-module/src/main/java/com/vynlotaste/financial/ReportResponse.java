package com.vynlotaste.financial;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReportResponse {
    private Long id;
    private String name;
    private String type;
    private String format;
    private String status;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private String periodType;
    private Long restaurantId;
    private String restaurantName;
}