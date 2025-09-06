package com.vynlotaste.event;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderStatusChangedEvent extends BaseEvent {
    
    private final Long orderId;
    private final String previousStatus;
    private final String newStatus;
    private final Long customerId;
    private final String orderNumber;
    private final String eventId = UUID.randomUUID().toString();
    
    @Override
    public String getEventId() {
        return eventId;
    }
    
    @Override
    public String getEventType() {
        return "ORDER_STATUS_CHANGED";
    }
}