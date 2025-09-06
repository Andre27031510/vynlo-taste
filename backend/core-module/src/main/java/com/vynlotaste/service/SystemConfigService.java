package com.vynlotaste.service;

import com.vynlotaste.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemConfigService {

    // Simulação de configurações do sistema - em produção viria do banco
    private final Map<String, Object> systemConfigs = new HashMap<>();

    @Cacheable(value = CacheConfig.SYSTEM_CONFIG_CACHE, key = "'config:' + #key")
    public Object getConfig(String key) {
        log.debug("Buscando configuração: {}", key);
        return systemConfigs.getOrDefault(key, getDefaultConfig(key));
    }

    @CachePut(value = CacheConfig.SYSTEM_CONFIG_CACHE, key = "'config:' + #key")
    public Object setConfig(String key, Object value) {
        log.debug("Atualizando configuração: {} = {}", key, value);
        systemConfigs.put(key, value);
        return value;
    }

    @CacheEvict(value = CacheConfig.SYSTEM_CONFIG_CACHE, key = "'config:' + #key")
    public void removeConfig(String key) {
        log.debug("Removendo configuração: {}", key);
        systemConfigs.remove(key);
    }

    @CacheEvict(value = CacheConfig.SYSTEM_CONFIG_CACHE, allEntries = true)
    public void clearAllConfigs() {
        log.debug("Limpando todas as configurações do cache");
        systemConfigs.clear();
    }

    @Cacheable(value = CacheConfig.SYSTEM_CONFIG_CACHE, key = "'all-configs'")
    public Map<String, Object> getAllConfigs() {
        log.debug("Buscando todas as configurações");
        Map<String, Object> allConfigs = new HashMap<>(systemConfigs);
        
        // Adiciona configurações padrão se não existirem
        if (!allConfigs.containsKey("delivery.fee")) {
            allConfigs.put("delivery.fee", 5.00);
        }
        if (!allConfigs.containsKey("min.order.value")) {
            allConfigs.put("min.order.value", 20.00);
        }
        if (!allConfigs.containsKey("max.delivery.distance")) {
            allConfigs.put("max.delivery.distance", 10.0);
        }
        
        return allConfigs;
    }

    private Object getDefaultConfig(String key) {
        return switch (key) {
            case "delivery.fee" -> 5.00;
            case "min.order.value" -> 20.00;
            case "max.delivery.distance" -> 10.0;
            case "restaurant.open.time" -> "08:00";
            case "restaurant.close.time" -> "22:00";
            case "max.preparation.time" -> 60;
            default -> null;
        };
    }

    // Métodos de conveniência para configurações específicas
    @Cacheable(value = CacheConfig.SYSTEM_CONFIG_CACHE, key = "'delivery-fee'")
    public Double getDeliveryFee() {
        return (Double) getConfig("delivery.fee");
    }

    @Cacheable(value = CacheConfig.SYSTEM_CONFIG_CACHE, key = "'min-order-value'")
    public Double getMinOrderValue() {
        return (Double) getConfig("min.order.value");
    }
}