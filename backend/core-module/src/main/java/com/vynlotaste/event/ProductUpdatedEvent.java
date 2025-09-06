package com.vynlotaste.event;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProductUpdatedEvent extends BaseEvent {
    
    private final Long productId;
    private final String name;
    private final BigDecimal price;
    private final Integer stockQuantity;
    private final Boolean available;
    private final String updateType; // PRICE_CHANGE, STOCK_UPDATE, AVAILABILITY_CHANGE
    private final String eventId = UUID.randomUUID().toString();
    
    @Override
    public String getEventId() {
        return eventId;
    }
    
    @Override
    public String getEventType() {
        return "PRODUCT_UPDATED";
    }
}