package com.vynlotaste.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventPublisher {
    
    private final ApplicationEventPublisher applicationEventPublisher;
    
    public void publishEvent(BaseEvent event) {
        try {
            log.debug("Publishing event: {} with ID: {}", event.getEventType(), event.getEventId());
            applicationEventPublisher.publishEvent(event);
            log.info("Event published successfully: {}", event.getEventType());
        } catch (Exception e) {
            log.error("Failed to publish event: {}", event.getEventType(), e);
            throw new RuntimeException("Event publishing failed", e);
        }
    }
}