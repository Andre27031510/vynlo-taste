package com.vynlotaste.financial;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountResponse {
    private Long id;
    private String name;
    private String type;
    private String category;
    private String status;
    private BigDecimal currentBalance;
    private BigDecimal availableBalance;
    private BigDecimal creditLimit;
    private Long restaurantId;
    private String restaurantName;
}