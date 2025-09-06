package com.vynlotaste.webhook;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WebhookPayload {
    
    private String eventType;
    private LocalDateTime timestamp;
    private Object data;
    @Builder.Default
    private String version = "1.0";
}