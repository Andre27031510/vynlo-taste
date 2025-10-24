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
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = com.vynlotaste.core.CoreModuleApplication.class)
@ActiveProfiles("test")
@DisplayName("TESTES DE STRESS E CARGA EXTREMA - SISTEMA ROBUSTO")
class StressTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @Test
    @DisplayName("STRESS TEST: 10.000 requisições simultâneas")
    void stressTest10000ConcurrentRequests() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfThreads = 10000;
        ExecutorService executor = Executors.newFixedThreadPool(1000); // Pool otimizado
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);
        AtomicLong maxResponseTime = new AtomicLong(0);
        AtomicLong minResponseTime = new AtomicLong(Long.MAX_VALUE);
        AtomicReference<Exception> firstError = new AtomicReference<>();

        long startTime = System.currentTimeMillis();

        // When
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    long requestStartTime = System.currentTimeMillis();
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "stress_%d_%d",
                            "email": "stress%d@vynlotaste.com",
                            "displayName": "Stress User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511999999%04d",
                            "photoURL": "https://example.com/stress%d.jpg",
                            "creationTime": "2024-12-25T10:30:00Z",
                            "lastSignInTime": "2024-12-25T10:30:00Z"
                        }
                        """, System.currentTimeMillis(), threadId, threadId, threadId, threadId % 10000, threadId);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    long responseTime = System.currentTimeMillis() - requestStartTime;
                    totalResponseTime.addAndGet(responseTime);
                    maxResponseTime.updateAndGet(current -> Math.max(current, responseTime));
                    minResponseTime.updateAndGet(current -> Math.min(current, responseTime));
                    successCount.incrementAndGet();
                    
                } catch (Exception e) {
                    errorCount.incrementAndGet();
                    firstError.compareAndSet(null, e);
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(60, TimeUnit.SECONDS); // Timeout de 1 minuto
        executor.shutdown();
        
        long totalTime = System.currentTimeMillis() - startTime;
        double successRate = (double) successCount.get() / numberOfThreads * 100;
        double averageResponseTime = successCount.get() > 0 ? (double) totalResponseTime.get() / successCount.get() : 0;
        double requestsPerSecond = (double) numberOfThreads / (totalTime / 1000.0);

        // Relatório detalhado
        System.out.println("\n=== RELATÓRIO DE STRESS TEST - 10.000 REQUISIÇÕES ===");
        System.out.println("Total de requisições: " + numberOfThreads);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Tempo total: " + totalTime + " ms");
        System.out.println("Requisições por segundo: " + String.format("%.2f", requestsPerSecond));
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", averageResponseTime));
        System.out.println("Tempo mínimo de resposta: " + minResponseTime.get() + " ms");
        System.out.println("Tempo máximo de resposta: " + maxResponseTime.get() + " ms");
        
        if (firstError.get() != null) {
            System.out.println("Primeiro erro: " + firstError.get().getMessage());
        }

        // Assertions para sistema robusto
        assertTrue(completed, "Teste deve completar em 60 segundos");
        assertTrue(successRate >= 95.0, "Taxa de sucesso deve ser pelo menos 95%");
        assertTrue(averageResponseTime <= 2000.0, "Tempo médio deve ser menor que 2 segundos");
        assertTrue(requestsPerSecond >= 100.0, "Deve processar pelo menos 100 req/s");
        assertTrue(maxResponseTime.get() <= 10000.0, "Tempo máximo deve ser menor que 10 segundos");
    }

    @Test
    @DisplayName("BURST TEST: Picos de 5.000 requisições em 1 segundo")
    void burstTest5000RequestsIn1Second() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int burstSize = 5000;
        ExecutorService executor = Executors.newFixedThreadPool(burstSize);
        CountDownLatch latch = new CountDownLatch(burstSize);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);

        long startTime = System.currentTimeMillis();

        // When - Enviar todas as requisições simultaneamente
        for (int i = 0; i < burstSize; i++) {
            final int requestId = i;
            executor.submit(() -> {
                try {
                    long requestStartTime = System.currentTimeMillis();
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "burst_%d_%d",
                            "email": "burst%d@vynlotaste.com",
                            "displayName": "Burst User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511888888%04d"
                        }
                        """, System.currentTimeMillis(), requestId, requestId, requestId, requestId % 10000);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    long responseTime = System.currentTimeMillis() - requestStartTime;
                    totalResponseTime.addAndGet(responseTime);
                    successCount.incrementAndGet();
                    
                } catch (Exception e) {
                    errorCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(30, TimeUnit.SECONDS);
        executor.shutdown();
        
        long totalTime = System.currentTimeMillis() - startTime;
        double successRate = (double) successCount.get() / burstSize * 100;
        double averageResponseTime = successCount.get() > 0 ? (double) totalResponseTime.get() / successCount.get() : 0;

        System.out.println("\n=== RELATÓRIO DE BURST TEST - 5.000 REQUISIÇÕES ===");
        System.out.println("Tamanho do burst: " + burstSize);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Tempo total: " + totalTime + " ms");
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", averageResponseTime));

        assertTrue(completed, "Burst test deve completar em 30 segundos");
        assertTrue(successRate >= 90.0, "Taxa de sucesso deve ser pelo menos 90% em burst");
        assertTrue(averageResponseTime <= 5000.0, "Tempo médio deve ser menor que 5 segundos");
    }

    @Test
    @DisplayName("MEMORY STRESS TEST: Requisições com payloads grandes")
    void memoryStressTestLargePayloads() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfRequests = 1000;
        int payloadSizeKB = 100; // 100KB por requisição
        ExecutorService executor = Executors.newFixedThreadPool(100);
        CountDownLatch latch = new CountDownLatch(numberOfRequests);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);

        // Criar payload grande
        StringBuilder largeData = new StringBuilder();
        for (int i = 0; i < payloadSizeKB * 100; i++) { // 100KB de dados
            largeData.append("a");
        }

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            final int requestId = i;
            executor.submit(() -> {
                try {
                    String largePayload = String.format("""
                        {
                            "firebaseUid": "memory_%d_%d",
                            "email": "memory%d@vynlotaste.com",
                            "displayName": "Memory Stress User %d with %s",
                            "emailVerified": true,
                            "phoneNumber": "+5511777777%04d",
                            "photoURL": "https://example.com/large_photo_%d.jpg",
                            "creationTime": "2024-12-25T10:30:00Z",
                            "lastSignInTime": "2024-12-25T10:30:00Z"
                        }
                        """, System.currentTimeMillis(), requestId, requestId, requestId, largeData.toString(), requestId % 10000, requestId);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(largePayload))
                            .andExpect(status().isOk());

                    successCount.incrementAndGet();
                    
                } catch (Exception e) {
                    errorCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(60, TimeUnit.SECONDS);
        executor.shutdown();
        
        double successRate = (double) successCount.get() / numberOfRequests * 100;

        System.out.println("\n=== RELATÓRIO DE MEMORY STRESS TEST ===");
        System.out.println("Requisições: " + numberOfRequests);
        System.out.println("Tamanho do payload: " + payloadSizeKB + "KB");
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));

        assertTrue(completed, "Memory stress test deve completar em 60 segundos");
        assertTrue(successRate >= 85.0, "Taxa de sucesso deve ser pelo menos 85% com payloads grandes");
    }

    @Test
    @DisplayName("CONCURRENT WRITE TEST: Múltiplas escritas simultâneas")
    void concurrentWriteTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfWriters = 500;
        int writesPerWriter = 10;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfWriters);
        CountDownLatch latch = new CountDownLatch(numberOfWriters * writesPerWriter);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicInteger duplicateCount = new AtomicInteger(0);

        // When
        for (int writer = 0; writer < numberOfWriters; writer++) {
            final int writerId = writer;
            executor.submit(() -> {
                for (int write = 0; write < writesPerWriter; write++) {
                    try {
                        String requestBody = String.format("""
                            {
                                "firebaseUid": "concurrent_%d_%d_%d",
                                "email": "concurrent%d_%d@vynlotaste.com",
                                "displayName": "Concurrent Writer %d Write %d",
                                "emailVerified": true,
                                "phoneNumber": "+5511666666%04d"
                            }
                            """, writerId, write, System.currentTimeMillis(), writerId, write, writerId, write, (writerId * writesPerWriter + write) % 10000);

                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());

                        successCount.incrementAndGet();
                        
                    } catch (Exception e) {
                        if (e.getMessage().contains("already exists")) {
                            duplicateCount.incrementAndGet();
                        } else {
                            errorCount.incrementAndGet();
                        }
                    } finally {
                        latch.countDown();
                    }
                }
            });
        }

        // Then
        boolean completed = latch.await(120, TimeUnit.SECONDS);
        executor.shutdown();
        
        int totalRequests = numberOfWriters * writesPerWriter;
        double successRate = (double) successCount.get() / totalRequests * 100;

        System.out.println("\n=== RELATÓRIO DE CONCURRENT WRITE TEST ===");
        System.out.println("Writers: " + numberOfWriters);
        System.out.println("Writes por writer: " + writesPerWriter);
        System.out.println("Total de requisições: " + totalRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Duplicatas: " + duplicateCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));

        assertTrue(completed, "Concurrent write test deve completar em 120 segundos");
        assertTrue(successRate >= 90.0, "Taxa de sucesso deve ser pelo menos 90%");
    }
}
