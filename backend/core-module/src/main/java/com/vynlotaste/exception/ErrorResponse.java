package com.vynlotaste.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String code;
    private String path;
    private String requestId;
    private String traceId;
    private List<ValidationError> validationErrors;
    private Map<String, Object> details;
    
    @Data
    @Builder
    public static class ValidationError {
        private String field;
        private Object rejectedValue;
        private String message;
        private String code;
    }
}