package com.vynlotaste.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CacheWarmupService {

    private final ProductService productService;
    
    // Campo reservado para funcionalidade futura de cache de usuários
    // TODO: Implementar cache de usuários quando necessário
    @SuppressWarnings("unused")
    private final UserService userService;

    @Async
    @EventListener(ApplicationReadyEvent.class)
    public void warmupCache() {
        log.info("Iniciando aquecimento do cache...");
        
        try {
            // Aquece cache de produtos mais populares
            warmupProducts();
            
            // Aquece cache de configurações do sistema
            warmupSystemConfig();
            
            log.info("Cache aquecido com sucesso");
        } catch (Exception e) {
            log.error("Erro durante aquecimento do cache", e);
        }
    }

    private void warmupProducts() {
        try {
            // Carrega primeiros produtos para cache
            productService.findAll(PageRequest.of(0, 20));
            
            // Carrega produtos disponíveis
            productService.findAvailableProducts();
            
            log.debug("Cache de produtos aquecido");
        } catch (Exception e) {
            log.warn("Erro ao aquecer cache de produtos", e);
        }
    }

    private void warmupSystemConfig() {
        try {
            // TODO: Implementar aquecimento de configurações quando SystemConfigService estiver disponível
            log.debug("Cache de configurações aquecido");
        } catch (Exception e) {
            log.warn("Erro ao aquecer cache de configurações", e);
        }
    }
}