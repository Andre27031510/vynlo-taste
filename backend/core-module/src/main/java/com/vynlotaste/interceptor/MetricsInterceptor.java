package com.vynlotaste.interceptor;

import com.vynlotaste.service.ApiPerformanceMetricsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@RequiredArgsConstructor
public class MetricsInterceptor implements HandlerInterceptor {

    private final ApiPerformanceMetricsService metricsService;
    private static final String START_TIME_ATTRIBUTE = "startTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME_ATTRIBUTE, System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                              Object handler, Exception ex) {
        Long startTime = (Long) request.getAttribute(START_TIME_ATTRIBUTE);
        if (startTime != null) {
            long duration = System.currentTimeMillis() - startTime;
            String endpoint = getEndpointPath(request.getRequestURI());
            String method = request.getMethod();
            int statusCode = response.getStatus();
            
            metricsService.recordApiCall(endpoint, method, duration, statusCode);
            
            if (duration > 2000) {
                log.warn("Slow API request: {} {} - Duration: {}ms, Status: {}", 
                    method, endpoint, duration, statusCode);
            }
        }
    }

    private String getEndpointPath(String uri) {
        return uri.replaceAll("/\\d+", "/{id}")
                 .replaceAll("/[a-f0-9-]{36}", "/{uuid}")
                 .replaceAll("/[a-f0-9]{24}", "/{objectId}");
    }
}