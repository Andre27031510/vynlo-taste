package com.vynlotaste.performance;

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

@SpringBootTest(classes = com.vynlotaste.core.CoreModuleApplication.class)
@ActiveProfiles("test")
@DisplayName("Testes de Carga e Performance - Sistema Robusto")
class LoadTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @Test
    @DisplayName("Deve suportar 1000 requisições simultâneas")
    void shouldSupport1000ConcurrentRequests() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfThreads = 1000;
        int requestsPerThread = 1;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);

        // When
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    long startTime = System.currentTimeMillis();
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "firebase_%d",
                            "email": "user%d@vynlotaste.com",
                            "displayName": "User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511999999%03d"
                        }
                        """, threadId, threadId, threadId, threadId);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    long responseTime = System.currentTimeMillis() - startTime;
                    totalResponseTime.addAndGet(responseTime);
                    successCount.incrementAndGet();
                    
                } catch (Exception e) {
                    errorCount.incrementAndGet();
                    System.err.println("Thread " + threadId + " failed: " + e.getMessage());
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(30, TimeUnit.SECONDS);
        executor.shutdown();

        assertTrue(completed, "Test should complete within 30 seconds");
        
        double successRate = (double) successCount.get() / numberOfThreads * 100;
        double averageResponseTime = (double) totalResponseTime.get() / successCount.get();
        
        System.out.println("=== RESULTADOS DO TESTE DE CARGA ===");
        System.out.println("Total de requisições: " + numberOfThreads);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", averageResponseTime));
        
        // Assertions para sistema robusto
        assertTrue(successRate >= 95.0, "Success rate should be at least 95%");
        assertTrue(averageResponseTime <= 1000.0, "Average response time should be under 1 second");
        assertTrue(errorCount.get() <= numberOfThreads * 0.05, "Error rate should be under 5%");
    }

    @Test
    @DisplayName("Deve manter performance sob carga sustentada")
    void shouldMaintainPerformanceUnderSustainedLoad() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int durationSeconds = 10;
        int requestsPerSecond = 50;
        int totalRequests = durationSeconds * requestsPerSecond;
        
        ExecutorService executor = Executors.newFixedThreadPool(20);
        CountDownLatch latch = new CountDownLatch(totalRequests);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);
        AtomicLong maxResponseTime = new AtomicLong(0);

        // When
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < totalRequests; i++) {
            final int requestId = i;
            executor.submit(() -> {
                try {
                    long requestStartTime = System.currentTimeMillis();
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "sustained_%d",
                            "email": "sustained%d@vynlotaste.com",
                            "displayName": "Sustained User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511888888%03d"
                        }
                        """, requestId, requestId, requestId, requestId % 1000);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    long responseTime = System.currentTimeMillis() - requestStartTime;
                    totalResponseTime.addAndGet(responseTime);
                    maxResponseTime.updateAndGet(current -> Math.max(current, responseTime));
                    successCount.incrementAndGet();
                    
                } catch (Exception e) {
                    errorCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
            
            // Rate limiting - 50 requests per second
            if (i % requestsPerSecond == 0 && i > 0) {
                Thread.sleep(1000);
            }
        }

        // Then
        boolean completed = latch.await(durationSeconds + 5, TimeUnit.SECONDS);
        executor.shutdown();
        
        long totalTime = System.currentTimeMillis() - startTime;
        double actualRequestsPerSecond = (double) totalRequests / (totalTime / 1000.0);

        assertTrue(completed, "Test should complete within expected time");
        
        double successRate = (double) successCount.get() / totalRequests * 100;
        double averageResponseTime = (double) totalResponseTime.get() / successCount.get();
        
        System.out.println("=== RESULTADOS DO TESTE SUSTENTADO ===");
        System.out.println("Duração: " + durationSeconds + " segundos");
        System.out.println("Total de requisições: " + totalRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", averageResponseTime));
        System.out.println("Tempo máximo de resposta: " + maxResponseTime.get() + " ms");
        System.out.println("Requisições por segundo: " + String.format("%.2f", actualRequestsPerSecond));
        
        // Assertions para sistema robusto
        assertTrue(successRate >= 98.0, "Success rate should be at least 98% under sustained load");
        assertTrue(averageResponseTime <= 500.0, "Average response time should be under 500ms");
        assertTrue(maxResponseTime.get() <= 2000.0, "Max response time should be under 2 seconds");
        assertTrue(actualRequestsPerSecond >= 45.0, "Should maintain at least 45 requests per second");
    }

    @Test
    @DisplayName("Deve recuperar de picos de carga")
    void shouldRecoverFromLoadSpikes() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int[] spikeSizes = {100, 200, 500, 1000};
        AtomicInteger totalSuccess = new AtomicInteger(0);
        AtomicInteger totalErrors = new AtomicInteger(0);

        // When
        for (int spikeSize : spikeSizes) {
            System.out.println("Testando pico de " + spikeSize + " requisições...");
            
            ExecutorService executor = Executors.newFixedThreadPool(spikeSize);
            CountDownLatch latch = new CountDownLatch(spikeSize);
            
            for (int i = 0; i < spikeSize; i++) {
                final int requestId = i;
                executor.submit(() -> {
                    try {
                        String requestBody = String.format("""
                            {
                                "firebaseUid": "spike_%d_%d",
                                "email": "spike%d@vynlotaste.com",
                                "displayName": "Spike User %d",
                                "emailVerified": true,
                                "phoneNumber": "+5511777777%03d"
                            }
                            """, spikeSize, requestId, requestId, requestId, requestId % 1000);

                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());

                        totalSuccess.incrementAndGet();
                        
                    } catch (Exception e) {
                        totalErrors.incrementAndGet();
                    } finally {
                        latch.countDown();
                    }
                });
            }
            
            latch.await(10, TimeUnit.SECONDS);
            executor.shutdown();
            
            // Pausa entre picos
            Thread.sleep(2000);
        }

        // Then
        int totalRequests = 100 + 200 + 500 + 1000;
        double successRate = (double) totalSuccess.get() / totalRequests * 100;
        
        System.out.println("=== RESULTADOS DOS PICOS DE CARGA ===");
        System.out.println("Total de requisições: " + totalRequests);
        System.out.println("Sucessos: " + totalSuccess.get());
        System.out.println("Erros: " + totalErrors.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        
        assertTrue(successRate >= 90.0, "Success rate should be at least 90% during load spikes");
    }
}
