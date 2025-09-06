package com.vynlotaste.exception.product;

import com.vynlotaste.exception.BaseException;
import com.vynlotaste.exception.ErrorCode;

public class ProductOutOfStockException extends BaseException {
    
    public ProductOutOfStockException(Long productId) {
        super(ErrorCode.PRODUCT_OUT_OF_STOCK, "Product out of stock with ID: " + productId, productId);
    }
    
    public ProductOutOfStockException(Long productId, int requested, int available) {
        super(ErrorCode.INSUFFICIENT_STOCK, 
            String.format("Insufficient stock for product %d. Requested: %d, Available: %d", 
                productId, requested, available), 
            productId, requested, available);
    }
}