package com.vynlotaste.config;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class TenantHibernateFilterInterceptor implements HandlerInterceptor {

    private final ObjectProvider<EntityManager> entityManagerProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        EntityManager entityManager = entityManagerProvider.getIfAvailable();
        if (entityManager == null) {
            return true;
        }
        try {
            Session session = entityManager.unwrap(Session.class);
            Filter filter = session.enableFilter("tenantFilter");
            if (tenantId != null) {
                filter.setParameter("tenantId", tenantId);
            } else {
                // Se não houver tenant definido, evitamos setar parâmetro nulo
                // O filtro continuará habilitado, mas sem parâmetro, não afetará queries
            }
        } catch (Exception e) {
            log.warn("Não foi possível habilitar tenantFilter: {}", e.getMessage());
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        EntityManager entityManager = entityManagerProvider.getIfAvailable();
        if (entityManager == null) {
            return;
        }
        try {
            Session session = entityManager.unwrap(Session.class);
            session.disableFilter("tenantFilter");
        } catch (Exception ignored) {
        }
    }
}


