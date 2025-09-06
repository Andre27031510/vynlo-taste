package com.vynlotaste.event;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserRegisteredEvent extends BaseEvent {
    
    private final Long userId;
    private final String email;
    private final String username;
    private final String firstName;
    private final String role;
    private final String eventId = UUID.randomUUID().toString();
    
    @Override
    public String getEventId() {
        return eventId;
    }
    
    @Override
    public String getEventType() {
        return "USER_REGISTERED";
    }
}