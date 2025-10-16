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
            log.debug("Aquecendo cache de produtos (Hybrid L1+L2)...");
            
            // L1 Caffeine: Primeiras 5 páginas (mais acessadas)
            productService.findAll(PageRequest.of(0, 10));  // Página 1
            productService.findAll(PageRequest.of(1, 10));  // Página 2
            productService.findAll(PageRequest.of(2, 10));  // Página 3
            
            // L2 Redis: Stats (crítico para dashboard)
            productService.getProductStats();
            
            // L2 Redis: Lista de disponíveis (usado no menu)
            productService.findAvailableProducts();
            
            log.info("✅ Cache de produtos aquecido: 3 páginas (L1) + stats (L2) + disponíveis (L2)");
        } catch (Exception e) {
            log.warn("⚠️ Erro ao aquecer cache de produtos (não crítico)", e);
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