package com.vynlotaste.exception;

public class InsufficientStockException extends BusinessException {
    public InsufficientStockException(String message) {
        super(ErrorCode.INSUFFICIENT_STOCK, message);
    }
}