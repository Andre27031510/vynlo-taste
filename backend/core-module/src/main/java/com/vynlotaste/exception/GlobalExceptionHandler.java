package com.vynlotaste.exception;

import com.vynlotaste.exception.payment.PaymentFailedException;
import com.vynlotaste.exception.security.InsufficientPermissionsException;
import com.vynlotaste.exception.user.UserNotFoundException;
import com.vynlotaste.exception.product.ProductOutOfStockException;
import com.vynlotaste.exception.order.OrderValidationException;
import com.vynlotaste.monitoring.SimpleMonitoringService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final MessageSource messageSource;
    private final SimpleMonitoringService monitoringService;
    private final ErrorMetricsService errorMetricsService;

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(
            BaseException ex, HttpServletRequest request) {
        
        logError(ex, request);
        monitoringService.recordError(ex.getErrorCode().getCode());
        errorMetricsService.recordError(ex.getErrorCode().getCode(), request.getRequestURI());
        
        // Alertas para exceções críticas
        if (isCriticalError(ex)) {
            errorMetricsService.recordCriticalError(ex.getErrorCode().getCode(), ex.getMessage(), ex);
        }
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(getHttpStatus(ex.getErrorCode()).value())
            .error(getHttpStatus(ex.getErrorCode()).getReasonPhrase())
            .message(getLocalizedMessage(ex))
            .code(ex.getErrorCode().getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(getHttpStatus(ex.getErrorCode())).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        logError(ex, request);
        monitoringService.recordError("VALIDATION_ERROR");
        errorMetricsService.recordError("VALIDATION_ERROR", request.getRequestURI());
        
        List<ErrorResponse.ValidationError> validationErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(this::mapFieldError)
            .collect(Collectors.toList());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Failed")
            .message("Invalid input data")
            .code(ErrorCode.VALIDATION_ERROR.getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .validationErrors(validationErrors)
            .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        
        logError(ex, request);
        monitoringService.recordError("ACCESS_DENIED");
        errorMetricsService.recordError("ACCESS_DENIED", request.getRequestURI());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.FORBIDDEN.value())
            .error("Access Denied")
            .message("Insufficient permissions")
            .code(ErrorCode.FORBIDDEN.getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex, HttpServletRequest request) {
        
        logError(ex, request);
        monitoringService.recordError("BAD_CREDENTIALS");
        errorMetricsService.recordError("BAD_CREDENTIALS", request.getRequestURI());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .error("Unauthorized")
            .message("Invalid credentials")
            .code(ErrorCode.INVALID_CREDENTIALS.getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(
            DataAccessException ex, HttpServletRequest request) {
        
        logError(ex, request);
        monitoringService.recordError("DATABASE_ERROR");
        errorMetricsService.recordError("DATABASE_ERROR", request.getRequestURI());
        errorMetricsService.recordCriticalError("DATABASE_ERROR", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("Database operation failed")
            .code(ErrorCode.DATABASE_ERROR.getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(PaymentFailedException.class)
    public ResponseEntity<ErrorResponse> handlePaymentFailedException(
            PaymentFailedException ex, HttpServletRequest request) {
        
        logError(ex, request);
        errorMetricsService.recordError("PAYMENT_FAILED", request.getRequestURI());
        errorMetricsService.recordCriticalError("PAYMENT_FAILED", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.PAYMENT_REQUIRED.value())
            .error("Payment Failed")
            .message(ex.getMessage())
            .code(ex.getErrorCode().getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(errorResponse);
    }

    @ExceptionHandler(InsufficientPermissionsException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientPermissionsException(
            InsufficientPermissionsException ex, HttpServletRequest request) {
        
        logError(ex, request);
        errorMetricsService.recordError("INSUFFICIENT_PERMISSIONS", request.getRequestURI());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.FORBIDDEN.value())
            .error("Insufficient Permissions")
            .message(ex.getMessage())
            .code(ex.getErrorCode().getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(
            UserNotFoundException ex, HttpServletRequest request) {
        
        logError(ex, request);
        errorMetricsService.recordError("USER_NOT_FOUND", request.getRequestURI());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("User Not Found")
            .message(ex.getMessage())
            .code(ex.getErrorCode().getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ProductOutOfStockException.class)
    public ResponseEntity<ErrorResponse> handleProductOutOfStockException(
            ProductOutOfStockException ex, HttpServletRequest request) {
        
        logError(ex, request);
        errorMetricsService.recordError("PRODUCT_OUT_OF_STOCK", request.getRequestURI());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.CONFLICT.value())
            .error("Product Out of Stock")
            .message(ex.getMessage())
            .code(ex.getErrorCode().getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(OrderValidationException.class)
    public ResponseEntity<ErrorResponse> handleOrderValidationException(
            OrderValidationException ex, HttpServletRequest request) {
        
        logError(ex, request);
        errorMetricsService.recordError("ORDER_VALIDATION_ERROR", request.getRequestURI());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Order Validation Failed")
            .message(ex.getMessage())
            .code(ex.getErrorCode().getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        
        logError(ex, request);
        monitoringService.recordError("INTERNAL_ERROR");
        errorMetricsService.recordError("INTERNAL_ERROR", request.getRequestURI());
        errorMetricsService.recordCriticalError("INTERNAL_ERROR", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("An unexpected error occurred")
            .code(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
            .path(request.getRequestURI())
            .requestId(MDC.get("requestId"))
            .traceId(MDC.get("traceId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private void logError(Exception ex, HttpServletRequest request) {
        Map<String, Object> errorContext = new HashMap<>();
        errorContext.put("method", request.getMethod());
        errorContext.put("uri", request.getRequestURI());
        errorContext.put("userAgent", request.getHeader("User-Agent"));
        errorContext.put("remoteAddr", request.getRemoteAddr());
        errorContext.put("requestId", MDC.get("requestId"));
        errorContext.put("traceId", MDC.get("traceId"));
        
        if (ex instanceof BaseException) {
            log.warn("Business exception occurred: {} - Context: {}", ex.getMessage(), errorContext);
        } else {
            log.error("System exception occurred: {} - Context: {}", ex.getMessage(), errorContext, ex);
        }
    }

    private HttpStatus getHttpStatus(ErrorCode errorCode) {
        return switch (errorCode.getCode().substring(3, 4)) {
            case "1", "2", "3" -> HttpStatus.NOT_FOUND;
            case "4" -> HttpStatus.PAYMENT_REQUIRED;
            case "5" -> HttpStatus.INTERNAL_SERVER_ERROR;
            case "6" -> HttpStatus.BAD_REQUEST;
            case "7" -> HttpStatus.UNAUTHORIZED;
            case "8" -> HttpStatus.TOO_MANY_REQUESTS;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }

    private String getLocalizedMessage(BaseException ex) {
        try {
            return messageSource.getMessage(
                ex.getErrorCode().getCode(),
                ex.getMessageArgs(),
                ex.getMessage(),
                LocaleContextHolder.getLocale()
            );
        } catch (Exception e) {
            return ex.getMessage();
        }
    }

    private ErrorResponse.ValidationError mapFieldError(FieldError fieldError) {
        return ErrorResponse.ValidationError.builder()
            .field(fieldError.getField())
            .rejectedValue(fieldError.getRejectedValue())
            .message(fieldError.getDefaultMessage())
            .code(fieldError.getCode())
            .build();
    }

    private boolean isCriticalError(BaseException ex) {
        String errorCode = ex.getErrorCode().getCode();
        return errorCode.startsWith("VT-4") || // Payment errors
               errorCode.startsWith("VT-5") || // System errors
               errorCode.equals("VT-2004") ||  // Insufficient stock
               errorCode.equals("VT-7003");    // Insufficient permissions
    }
}