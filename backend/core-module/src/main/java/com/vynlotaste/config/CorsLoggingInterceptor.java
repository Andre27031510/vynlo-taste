package com.vynlotaste.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@RequiredArgsConstructor
public class CorsLoggingInterceptor implements HandlerInterceptor {

    private final VynloProperties vynloProperties;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!vynloProperties.getCors().isLoggingEnabled()) {
            return true;
        }

        String origin = request.getHeader("Origin");
        String method = request.getMethod();
        String uri = request.getRequestURI();

        if ("OPTIONS".equals(method)) {
            log.debug("CORS preflight request - Origin: {}, URI: {}, Method: {}", 
                origin, uri, request.getHeader("Access-Control-Request-Method"));
        } else if (origin != null) {
            log.debug("CORS request - Origin: {}, Method: {}, URI: {}", origin, method, uri);
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                              Object handler, Exception ex) {
        if (!vynloProperties.getCors().isLoggingEnabled()) {
            return;
        }

        String origin = request.getHeader("Origin");
        if (origin != null) {
            String corsOrigin = response.getHeader("Access-Control-Allow-Origin");
            int status = response.getStatus();
            
            if (corsOrigin != null) {
                log.debug("CORS response - Origin: {}, Status: {}, Allowed: {}", 
                    origin, status, corsOrigin);
            } else {
                log.warn("CORS response - Origin: {}, Status: {}, BLOCKED", origin, status);
            }
        }
    }
}