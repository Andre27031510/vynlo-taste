package com.vynlotaste.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent extends BaseEvent {
    
    private String eventType;
    private Long orderId;
    private Long customerId;
    private LocalDateTime timestamp;
    
    public OrderEvent(String eventType, Long orderId, Long customerId) {
        this.eventType = eventType;
        this.orderId = orderId;
        this.customerId = customerId;
        this.timestamp = LocalDateTime.now();
    }
    
    @Override
    public String getEventId() {
        return "ORDER_" + orderId + "_" + timestamp.toString();
    }
    
    @Override
    public String getEventType() {
        return eventType;
    }
}