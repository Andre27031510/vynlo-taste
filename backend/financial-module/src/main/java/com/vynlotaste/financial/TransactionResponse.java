package com.vynlotaste.financial;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private String type;
    private String category;
    private String status;
    private LocalDate transactionDate;
    private Long accountId;
    private String accountName;
    private Long restaurantId;
    private String restaurantName;
}