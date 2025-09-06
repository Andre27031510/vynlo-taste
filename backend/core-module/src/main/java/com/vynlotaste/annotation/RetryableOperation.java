package com.vynlotaste.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RetryableOperation {
    
    String value() default "";
    
    RetryType type() default RetryType.EXTERNAL_SERVICE;
    
    int maxAttempts() default -1;
    
    long initialDelay() default -1;
    
    boolean silentFallback() default false;
    
    Class<? extends Exception>[] ignoreExceptions() default {};
    
    Class<? extends Exception>[] retryExceptions() default {};

    enum RetryType {
        DATABASE,
        FIREBASE, 
        REDIS,
        EXTERNAL_SERVICE
    }
}