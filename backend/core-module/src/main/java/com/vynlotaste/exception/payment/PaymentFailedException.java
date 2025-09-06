package com.vynlotaste.exception.payment;

import com.vynlotaste.exception.BaseException;
import com.vynlotaste.exception.ErrorCode;

public class PaymentFailedException extends BaseException {
    
    public PaymentFailedException(String paymentId, String reason) {
        super(ErrorCode.PAYMENT_FAILED, 
            String.format("Payment failed for ID %s: %s", paymentId, reason), 
            paymentId, reason);
    }
    
    public PaymentFailedException(String paymentId, String reason, Throwable cause) {
        super(ErrorCode.PAYMENT_FAILED, 
            String.format("Payment failed for ID %s: %s", paymentId, reason), 
            cause);
    }
    
    public PaymentFailedException(Double amount, String method, String reason) {
        super(ErrorCode.PAYMENT_FAILED, 
            String.format("Payment of %.2f via %s failed: %s", amount, method, reason), 
            amount, method, reason);
    }
}