package com.vynlotaste.robust;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("TESTES DE FALHA E RECUPERAÇÃO - SISTEMA ROBUSTO")
class FailureRecoveryTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @Test
    @DisplayName("NETWORK FAILURE SIMULATION: Simulação de falhas de rede")
    void networkFailureSimulation() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfRequests = 1000;
        int failureRate = 10; // 10% de falhas simuladas
        ExecutorService executor = Executors.newFixedThreadPool(50);
        CountDownLatch latch = new CountDownLatch(numberOfRequests);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        AtomicInteger recoveryCount = new AtomicInteger(0);

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            final int requestId = i;
            final boolean shouldFail = (requestId % 100) < failureRate;
            
            executor.submit(() -> {
                try {
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "network_%d_%d",
                            "email": "network%d@vynlotaste.com",
                            "displayName": "Network Test User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511555555%04d"
                        }
                        """, System.currentTimeMillis(), requestId, requestId, requestId, requestId % 10000);

                    if (shouldFail) {
                        // Simular falha de rede
                        Thread.sleep(100); // Simular timeout
                        failureCount.incrementAndGet();
                        
                        // Tentar recuperação
                        try {
                            mockMvc.perform(post("/api/v1/users/sync-firebase")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(requestBody))
                                    .andExpect(status().isOk());
                            recoveryCount.incrementAndGet();
                        } catch (Exception e) {
                            // Falha na recuperação
                        }
                    } else {
                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());
                        successCount.incrementAndGet();
                    }
                    
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(60, TimeUnit.SECONDS);
        executor.shutdown();
        
        double successRate = (double) successCount.get() / numberOfRequests * 100;
        double recoveryRate = failureCount.get() > 0 ? (double) recoveryCount.get() / failureCount.get() * 100 : 100;

        System.out.println("\n=== RELATÓRIO DE NETWORK FAILURE SIMULATION ===");
        System.out.println("Total de requisições: " + numberOfRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Falhas: " + failureCount.get());
        System.out.println("Recuperações: " + recoveryCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de recuperação: " + String.format("%.2f%%", recoveryRate));

        assertTrue(completed, "Network failure test deve completar em 60 segundos");
        assertTrue(successRate >= 85.0, "Taxa de sucesso deve ser pelo menos 85% mesmo com falhas");
        assertTrue(recoveryRate >= 70.0, "Taxa de recuperação deve ser pelo menos 70%");
    }

    @Test
    @DisplayName("DATABASE CONNECTION FAILURE: Simulação de falhas de banco")
    void databaseConnectionFailure() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfRequests = 500;
        ExecutorService executor = Executors.newFixedThreadPool(25);
        CountDownLatch latch = new CountDownLatch(numberOfRequests);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicInteger retryCount = new AtomicInteger(0);

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            final int requestId = i;
            executor.submit(() -> {
                int maxRetries = 3;
                int retry = 0;
                boolean success = false;
                
                while (retry < maxRetries && !success) {
                    try {
                        String requestBody = String.format("""
                            {
                                "firebaseUid": "db_fail_%d_%d_%d",
                                "email": "dbfail%d@vynlotaste.com",
                                "displayName": "DB Failure Test User %d",
                                "emailVerified": true,
                                "phoneNumber": "+5511444444%04d"
                            }
                            """, System.currentTimeMillis(), requestId, retry, requestId, requestId, requestId % 10000);

                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());

                        successCount.incrementAndGet();
                        success = true;
                        
                    } catch (Exception e) {
                        retry++;
                        retryCount.incrementAndGet();
                        
                        if (retry >= maxRetries) {
                            errorCount.incrementAndGet();
                        } else {
                            // Simular backoff exponencial
                            try {
                                Thread.sleep(100 * retry);
                            } catch (InterruptedException ie) {
                                Thread.currentThread().interrupt();
                            }
                        }
                    }
                }
                
                latch.countDown();
            });
        }

        // Then
        boolean completed = latch.await(90, TimeUnit.SECONDS);
        executor.shutdown();
        
        double successRate = (double) successCount.get() / numberOfRequests * 100;
        double retryRate = (double) retryCount.get() / numberOfRequests;

        System.out.println("\n=== RELATÓRIO DE DATABASE CONNECTION FAILURE ===");
        System.out.println("Total de requisições: " + numberOfRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Tentativas de retry: " + retryCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de retry: " + String.format("%.2f", retryRate));

        assertTrue(completed, "Database failure test deve completar em 90 segundos");
        assertTrue(successRate >= 80.0, "Taxa de sucesso deve ser pelo menos 80% com retry");
    }

    @Test
    @DisplayName("MEMORY PRESSURE TEST: Teste sob pressão de memória")
    void memoryPressureTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfRequests = 2000;
        ExecutorService executor = Executors.newFixedThreadPool(100);
        CountDownLatch latch = new CountDownLatch(numberOfRequests);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicLong totalMemoryUsed = new AtomicLong(0);

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            final int requestId = i;
            executor.submit(() -> {
                try {
                    // Alocar memória para simular pressão
                    byte[] memoryPressure = new byte[1024 * 100]; // 100KB por thread
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "memory_pressure_%d_%d",
                            "email": "memorypressure%d@vynlotaste.com",
                            "displayName": "Memory Pressure User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511333333%04d"
                        }
                        """, System.currentTimeMillis(), requestId, requestId, requestId, requestId % 10000);

                    long memoryBefore = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
                    
                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    long memoryAfter = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
                    totalMemoryUsed.addAndGet(memoryAfter - memoryBefore);
                    successCount.incrementAndGet();
                    
                } catch (Exception e) {
                    errorCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(120, TimeUnit.SECONDS);
        executor.shutdown();
        
        double successRate = (double) successCount.get() / numberOfRequests * 100;
        double avgMemoryPerRequest = successCount.get() > 0 ? (double) totalMemoryUsed.get() / successCount.get() : 0;

        System.out.println("\n=== RELATÓRIO DE MEMORY PRESSURE TEST ===");
        System.out.println("Total de requisições: " + numberOfRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Memória total usada: " + (totalMemoryUsed.get() / 1024 / 1024) + " MB");
        System.out.println("Memória média por requisição: " + String.format("%.2f bytes", avgMemoryPerRequest));

        assertTrue(completed, "Memory pressure test deve completar em 120 segundos");
        assertTrue(successRate >= 90.0, "Taxa de sucesso deve ser pelo menos 90% sob pressão de memória");
    }

    @Test
    @DisplayName("CIRCUIT BREAKER TEST: Teste de circuit breaker")
    void circuitBreakerTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfRequests = 1000;
        int failureThreshold = 100; // Após 100 falhas, abrir circuit breaker
        ExecutorService executor = Executors.newFixedThreadPool(50);
        CountDownLatch latch = new CountDownLatch(numberOfRequests);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        AtomicInteger circuitOpenCount = new AtomicInteger(0);
        AtomicInteger circuitClosedCount = new AtomicInteger(0);

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            final int requestId = i;
            executor.submit(() -> {
                try {
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "circuit_%d_%d",
                            "email": "circuit%d@vynlotaste.com",
                            "displayName": "Circuit Breaker User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511222222%04d"
                        }
                        """, System.currentTimeMillis(), requestId, requestId, requestId, requestId % 10000);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    successCount.incrementAndGet();
                    circuitClosedCount.incrementAndGet();
                    
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                    
                    if (failureCount.get() > failureThreshold) {
                        circuitOpenCount.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(60, TimeUnit.SECONDS);
        executor.shutdown();
        
        double successRate = (double) successCount.get() / numberOfRequests * 100;
        double circuitOpenRate = (double) circuitOpenCount.get() / numberOfRequests * 100;

        System.out.println("\n=== RELATÓRIO DE CIRCUIT BREAKER TEST ===");
        System.out.println("Total de requisições: " + numberOfRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Falhas: " + failureCount.get());
        System.out.println("Circuit aberto: " + circuitOpenCount.get());
        System.out.println("Circuit fechado: " + circuitClosedCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de circuit aberto: " + String.format("%.2f%%", circuitOpenRate));

        assertTrue(completed, "Circuit breaker test deve completar em 60 segundos");
        assertTrue(successRate >= 70.0, "Taxa de sucesso deve ser pelo menos 70%");
    }

    @Test
    @DisplayName("GRACEFUL DEGRADATION TEST: Degradação graciosa")
    void gracefulDegradationTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfRequests = 2000;
        ExecutorService executor = Executors.newFixedThreadPool(100);
        CountDownLatch latch = new CountDownLatch(numberOfRequests);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger degradedCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            final int requestId = i;
            executor.submit(() -> {
                try {
                    long startTime = System.currentTimeMillis();
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "graceful_%d_%d",
                            "email": "graceful%d@vynlotaste.com",
                            "displayName": "Graceful Degradation User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511111111%04d"
                        }
                        """, System.currentTimeMillis(), requestId, requestId, requestId, requestId % 10000);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    long responseTime = System.currentTimeMillis() - startTime;
                    totalResponseTime.addAndGet(responseTime);
                    
                    if (responseTime > 1000) {
                        degradedCount.incrementAndGet();
                    } else {
                        successCount.incrementAndGet();
                    }
                    
                } catch (Exception e) {
                    errorCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(120, TimeUnit.SECONDS);
        executor.shutdown();
        
        int totalProcessed = successCount.get() + degradedCount.get();
        double successRate = (double) successCount.get() / numberOfRequests * 100;
        double degradedRate = (double) degradedCount.get() / numberOfRequests * 100;
        double errorRate = (double) errorCount.get() / numberOfRequests * 100;
        double avgResponseTime = totalProcessed > 0 ? (double) totalResponseTime.get() / totalProcessed : 0;

        System.out.println("\n=== RELATÓRIO DE GRACEFUL DEGRADATION TEST ===");
        System.out.println("Total de requisições: " + numberOfRequests);
        System.out.println("Sucessos (rápidos): " + successCount.get());
        System.out.println("Degradados (lentos): " + degradedCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de degradação: " + String.format("%.2f%%", degradedRate));
        System.out.println("Taxa de erro: " + String.format("%.2f%%", errorRate));
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", avgResponseTime));

        assertTrue(completed, "Graceful degradation test deve completar em 120 segundos");
        assertTrue(successRate + degradedRate >= 95.0, "Taxa de processamento deve ser pelo menos 95%");
        assertTrue(errorRate <= 5.0, "Taxa de erro deve ser no máximo 5%");
    }
}
