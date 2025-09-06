package com.vynlotaste.exception;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
public class BusinessException extends BaseException {
    
    private final String businessContext;
    private final String operationType;
    
    public BusinessException(ErrorCode errorCode) {
        super(errorCode);
        this.businessContext = "general";
        this.operationType = "unknown";
        logBusinessError();
    }
    
    public BusinessException(ErrorCode errorCode, String message) {
        super(errorCode, message);
        this.businessContext = "general";
        this.operationType = "unknown";
        logBusinessError();
    }
    
    public BusinessException(ErrorCode errorCode, String message, String businessContext, String operationType) {
        super(errorCode, message);
        this.businessContext = businessContext;
        this.operationType = operationType;
        logBusinessError();
    }
    
    public BusinessException(ErrorCode errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
        this.businessContext = "general";
        this.operationType = "unknown";
        logBusinessError();
    }
    
    private void logBusinessError() {
        log.warn("Business rule violation - Code: {}, Context: {}, Operation: {}, Message: {}", 
            getErrorCode().getCode(), businessContext, operationType, getMessage());
    }
}
