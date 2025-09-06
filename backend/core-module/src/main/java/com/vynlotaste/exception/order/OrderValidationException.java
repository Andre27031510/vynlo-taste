package com.vynlotaste.exception.order;

import com.vynlotaste.exception.BaseException;
import com.vynlotaste.exception.ErrorCode;

public class OrderValidationException extends BaseException {
    
    public OrderValidationException(String message) {
        super(ErrorCode.ORDER_VALIDATION_ERROR, message);
    }
    
    public OrderValidationException(String field, String value) {
        super(ErrorCode.ORDER_VALIDATION_ERROR, 
            String.format("Invalid value '%s' for field '%s'", value, field), 
            field, value);
    }
}