package com.vynlotaste.service;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.ExternalOrder;
import com.vynlotaste.entity.Integration;
import com.vynlotaste.entity.Order;
import com.vynlotaste.repository.ExternalOrderRepository;
import com.vynlotaste.repository.IntegrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * ExternalOrderSyncService - Sincronização de Pedidos Externos
 * v2.1.0 - Sincroniza pedidos de plataformas externas com sistema interno
 * Updated: 2025-10-25 | Multi-tenancy e validação de integrações
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExternalOrderSyncService {

    private final ExternalOrderRepository externalOrderRepository;
    private final IntegrationRepository integrationRepository;

    /**
     * Sincronizar pedido externo com sistema interno
     * ✅ MULTI-TENANT: Validação de tenant_id
     */
    @Transactional
    public ExternalOrder syncExternalOrder(ExternalOrder externalOrder) {
        log.info("🔄 Sincronizando pedido externo: {} - Plataforma: {}", 
                externalOrder.getExternalId(), externalOrder.getIntegration().getType());
        
        try {
            // ✅ VALIDAÇÃO: Verificar se já existe
            Optional<ExternalOrder> existingOrder = externalOrderRepository
                .findByTenantIdAndExternalId(externalOrder.getTenantId(), externalOrder.getExternalId());
            
            if (existingOrder.isPresent()) {
                log.info("⏭️ Pedido externo já existe: {} - Atualizando", externalOrder.getExternalId());
                return updateExistingExternalOrder(existingOrder.get(), externalOrder);
            }
            
            // ✅ VALIDAÇÃO: Verificar se a integração está ativa
            Integration integration = externalOrder.getIntegration();
            if (!integration.isActive()) {
                log.warn("⚠️ Integração inativa: {} - Não é possível sincronizar pedido", integration.getName());
                externalOrder.setSyncStatus("FAILED");
                externalOrder.setLastSyncError("Integração inativa");
                externalOrder.setSyncAttempts(externalOrder.getSyncAttempts() + 1);
                return externalOrderRepository.save(externalOrder);
            }
            
            // Salvar pedido externo
            externalOrder.setCreatedAt(LocalDateTime.now());
            externalOrder.setUpdatedAt(LocalDateTime.now());
            ExternalOrder savedExternalOrder = externalOrderRepository.save(externalOrder);
            
            // Tentar criar pedido interno
            try {
                Order internalOrder = createInternalOrderFromExternal(savedExternalOrder);
                savedExternalOrder.setInternalOrderId(internalOrder.getId());
                savedExternalOrder.setSyncStatus("SUCCESS");
                savedExternalOrder.setLastSyncAt(LocalDateTime.now());
                savedExternalOrder.setSyncAttempts(savedExternalOrder.getSyncAttempts() + 1);
                
                log.info("✅ Pedido interno criado: ID={} para pedido externo: {}", 
                        internalOrder.getId(), savedExternalOrder.getExternalId());
                
            } catch (Exception e) {
                log.error("❌ Erro ao criar pedido interno para pedido externo: {}", 
                        savedExternalOrder.getExternalId(), e);
                savedExternalOrder.setSyncStatus("FAILED");
                savedExternalOrder.setLastSyncError(e.getMessage());
                savedExternalOrder.setSyncAttempts(savedExternalOrder.getSyncAttempts() + 1);
            }
            
            // Atualizar contador de pedidos da integração
            updateIntegrationOrderCount(integration);
            
            return externalOrderRepository.save(savedExternalOrder);
            
        } catch (Exception e) {
            log.error("❌ Erro ao sincronizar pedido externo: {}", externalOrder.getExternalId(), e);
            externalOrder.setSyncStatus("FAILED");
            externalOrder.setLastSyncError(e.getMessage());
            externalOrder.setSyncAttempts(externalOrder.getSyncAttempts() + 1);
            return externalOrderRepository.save(externalOrder);
        }
    }

    /**
     * Atualizar pedido externo existente
     */
    @Transactional
    public ExternalOrder updateExistingExternalOrder(ExternalOrder existing, ExternalOrder updated) {
        log.info("📝 Atualizando pedido externo existente: {}", existing.getExternalId());
        
        // Atualizar campos
        existing.setStatus(updated.getStatus());
        existing.setCustomerName(updated.getCustomerName());
        existing.setCustomerPhone(updated.getCustomerPhone());
        existing.setCustomerEmail(updated.getCustomerEmail());
        existing.setDeliveryAddress(updated.getDeliveryAddress());
        existing.setTotalAmount(updated.getTotalAmount());
        existing.setDeliveryFee(updated.getDeliveryFee());
        existing.setServiceFee(updated.getServiceFee());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setPaymentStatus(updated.getPaymentStatus());
        existing.setEstimatedDeliveryTime(updated.getEstimatedDeliveryTime());
        existing.setNotes(updated.getNotes());
        existing.setItems(updated.getItems());
        existing.setMetadata(updated.getMetadata());
        existing.setUpdatedAt(LocalDateTime.now());
        
        // Se ainda não foi sincronizado, tentar novamente
        if (existing.getInternalOrderId() == null) {
            try {
                Order internalOrder = createInternalOrderFromExternal(existing);
                existing.setInternalOrderId(internalOrder.getId());
                existing.setSyncStatus("SUCCESS");
                existing.setLastSyncAt(LocalDateTime.now());
                
                log.info("✅ Pedido interno criado na atualização: ID={}", internalOrder.getId());
                
            } catch (Exception e) {
                log.error("❌ Erro ao criar pedido interno na atualização: {}", existing.getExternalId(), e);
                existing.setSyncStatus("FAILED");
                existing.setLastSyncError(e.getMessage());
            }
        }
        
        existing.setSyncAttempts(existing.getSyncAttempts() + 1);
        return externalOrderRepository.save(existing);
    }

    /**
     * Criar pedido interno baseado no pedido externo
     */
    private Order createInternalOrderFromExternal(ExternalOrder externalOrder) {
        log.info("🏗️ Criando pedido interno para pedido externo: {}", externalOrder.getExternalId());
        
        // TODO: Implementar criação de pedido interno
        // Por enquanto, retornar um pedido mock
        // Em produção, isso seria implementado com:
        // - Criação de Customer se não existir
        // - Criação de OrderItems baseado nos itens do pedido externo
        // - Definição de status e tipo de pedido
        
        throw new RuntimeException("Criação de pedido interno não implementada ainda");
    }

    /**
     * Atualizar contador de pedidos da integração
     */
    @Transactional
    public void updateIntegrationOrderCount(Integration integration) {
        try {
            Long orderCount = externalOrderRepository.countByTenantIdAndCreatedAtAfter(
                integration.getTenantId(), 
                LocalDateTime.now().minusDays(1) // Últimas 24 horas
            );
            
            integration.setOrdersCount(orderCount);
            integration.setLastSyncAt(LocalDateTime.now());
            integrationRepository.save(integration);
            
            log.debug("📊 Contador de pedidos atualizado para integração {}: {}", 
                    integration.getName(), orderCount);
            
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar contador de pedidos da integração: {}", 
                    integration.getName(), e);
        }
    }

    /**
     * Buscar pedidos externos pendentes de sincronização
     */
    public List<ExternalOrder> findPendingSyncOrders() {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os pedidos pendentes");
            return externalOrderRepository.findBySyncStatus("PENDING");
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        
        log.debug("👤 Cliente (tenant_id={}): retornando pedidos pendentes do tenant", tenantId);
        return externalOrderRepository.findByTenantIdAndSyncStatus(tenantId, "PENDING");
    }

    /**
     * Reprocessar pedidos externos com falha
     */
    @Transactional
    public List<ExternalOrder> reprocessFailedOrders() {
        List<ExternalOrder> failedOrders = findFailedSyncOrders();
        
        log.info("🔄 Reprocessando {} pedidos externos com falha", failedOrders.size());
        
        for (ExternalOrder failedOrder : failedOrders) {
            if (failedOrder.getSyncAttempts() < 3) { // Máximo 3 tentativas
                try {
                    syncExternalOrder(failedOrder);
                } catch (Exception e) {
                    log.error("❌ Erro ao reprocessar pedido externo: {}", failedOrder.getExternalId(), e);
                }
            }
        }
        
        return failedOrders;
    }

    /**
     * Buscar pedidos externos com falha de sincronização
     */
    public List<ExternalOrder> findFailedSyncOrders() {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os pedidos com falha");
            return externalOrderRepository.findBySyncStatus("FAILED");
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        
        log.debug("👤 Cliente (tenant_id={}): retornando pedidos com falha do tenant", tenantId);
        return externalOrderRepository.findByTenantIdAndSyncStatus(tenantId, "FAILED");
    }

    /**
     * Obter estatísticas de sincronização
     */
    public java.util.Map<String, Object> getSyncStatistics() {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (tenantId == null && !TenantContext.isSuperAdmin()) {
            return java.util.Map.of(
                "totalOrders", 0,
                "successfulSyncs", 0,
                "failedSyncs", 0,
                "pendingSyncs", 0,
                "syncRate", 0.0
            );
        }
        
        long totalOrders = tenantId != null ? 
            externalOrderRepository.countByTenantIdAndCreatedAtAfter(tenantId, LocalDateTime.now().minusDays(30)) :
            externalOrderRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(30));
        
        long successfulSyncs = tenantId != null ?
            externalOrderRepository.findByTenantIdAndSyncStatus(tenantId, "SUCCESS").size() :
            externalOrderRepository.findBySyncStatus("SUCCESS").size();
        
        long failedSyncs = tenantId != null ?
            externalOrderRepository.findByTenantIdAndSyncStatus(tenantId, "FAILED").size() :
            externalOrderRepository.findBySyncStatus("FAILED").size();
        
        long pendingSyncs = tenantId != null ?
            externalOrderRepository.findByTenantIdAndSyncStatus(tenantId, "PENDING").size() :
            externalOrderRepository.findBySyncStatus("PENDING").size();
        
        double syncRate = totalOrders > 0 ? (double) successfulSyncs / totalOrders * 100 : 0;
        
        return java.util.Map.of(
            "totalOrders", totalOrders,
            "successfulSyncs", successfulSyncs,
            "failedSyncs", failedSyncs,
            "pendingSyncs", pendingSyncs,
            "syncRate", Math.round(syncRate * 10.0) / 10.0
        );
    }
}
