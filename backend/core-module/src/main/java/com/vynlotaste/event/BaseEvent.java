package com.vynlotaste.event;

import java.time.LocalDateTime;

public abstract class BaseEvent {
    
    public abstract String getEventId();
    public abstract String getEventType();
    
    public LocalDateTime getTimestamp() {
        return LocalDateTime.now();
    }
}