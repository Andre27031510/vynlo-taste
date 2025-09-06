package com.vynlotaste.exception;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {
    
    private final ErrorCode errorCode;
    private final Object[] messageArgs;
    
    protected BaseException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
        this.messageArgs = new Object[0];
    }
    
    protected BaseException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.messageArgs = new Object[0];
    }
    
    protected BaseException(ErrorCode errorCode, String message, Object... messageArgs) {
        super(message);
        this.errorCode = errorCode;
        this.messageArgs = messageArgs;
    }
    
    protected BaseException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.messageArgs = new Object[0];
    }
}