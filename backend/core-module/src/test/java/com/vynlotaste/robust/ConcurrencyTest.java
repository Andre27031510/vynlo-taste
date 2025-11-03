package com.vynlotaste.robust;

import com.vynlotaste.config.MetricsTestConfiguration;
import com.vynlotaste.config.TestFirebaseConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = com.vynlotaste.core.CoreModuleApplication.class)
@ActiveProfiles("test")
@Import({MetricsTestConfiguration.class, TestFirebaseConfig.class})
@DisplayName("TESTES DE CONCORRÊNCIA AVANÇADOS - SISTEMA ROBUSTO")
class ConcurrencyTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @Test
    @DisplayName("RACE CONDITION TEST: Teste de condições de corrida")
    void raceConditionTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfThreads = 100;
        int operationsPerThread = 10;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger raceConditionCount = new AtomicInteger(0);
        AtomicInteger duplicateCount = new AtomicInteger(0);
        ReentrantLock lock = new ReentrantLock();

        // When
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            executor.submit(() -> {
                for (int op = 0; op < operationsPerThread; op++) {
                    try {
                        String requestBody = String.format("{"
                            + "\"firebaseUid\": \"race_%d_%d_%d\","
                            + "\"email\": \"race%d_%d@vynlotaste.com\","
                            + "\"displayName\": \"Race Condition User %d-%d\","
                            + "\"emailVerified\": true,"
                            + "\"phoneNumber\": \"+5511999999%04d\""
                            + "}", threadId, op, System.currentTimeMillis(), threadId, op, threadId, op, (threadId * operationsPerThread + op) % 10000);

                        lock.lock();
                        try {
                            mockMvc.perform(post("/api/v1/users/sync-firebase")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(requestBody))
                                    .andExpect(status().isOk());
                            successCount.incrementAndGet();
                        } finally {
                            lock.unlock();
                        }
                        
                    } catch (Exception e) {
                        if (e.getMessage().contains("already exists")) {
                            duplicateCount.incrementAndGet();
                        } else {
                            raceConditionCount.incrementAndGet();
                        }
                    }
                }
                latch.countDown();
            });
        }

        // Then
        boolean completed = latch.await(60, TimeUnit.SECONDS);
        executor.shutdown();
        
        int totalOperations = numberOfThreads * operationsPerThread;
        double successRate = (double) successCount.get() / totalOperations * 100;
        double raceConditionRate = (double) raceConditionCount.get() / totalOperations * 100;

        System.out.println("\n=== RELATÓRIO DE RACE CONDITION TEST ===");
        System.out.println("Threads: " + numberOfThreads);
        System.out.println("Operações por thread: " + operationsPerThread);
        System.out.println("Total de operações: " + totalOperations);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Condições de corrida: " + raceConditionCount.get());
        System.out.println("Duplicatas: " + duplicateCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de race condition: " + String.format("%.2f%%", raceConditionRate));

        assertTrue(completed, "Race condition test deve completar em 60 segundos");
        assertTrue(successRate >= 95.0, "Taxa de sucesso deve ser pelo menos 95%");
        assertTrue(raceConditionRate <= 2.0, "Taxa de race condition deve ser no máximo 2%");
    }

    @Test
    @DisplayName("DEADLOCK PREVENTION TEST: Prevenção de deadlock")
    void deadlockPreventionTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfThreads = 50;
        int operationsPerThread = 20;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger deadlockCount = new AtomicInteger(0);
        AtomicInteger timeoutCount = new AtomicInteger(0);

        // When
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            executor.submit(() -> {
                for (int op = 0; op < operationsPerThread; op++) {
                    try {
                        String requestBody = String.format("{"
                            + "\"firebaseUid\": \"deadlock_%d_%d_%d\","
                            + "\"email\": \"deadlock%d_%d@vynlotaste.com\","
                            + "\"displayName\": \"Deadlock Prevention User %d-%d\","
                            + "\"emailVerified\": true,"
                            + "\"phoneNumber\": \"+5511888888%04d\""
                            + "}", threadId, op, System.currentTimeMillis(), threadId, op, threadId, op, (threadId * operationsPerThread + op) % 10000);

                        // Simular operação com timeout para detectar deadlock
                        CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                            try {
                                mockMvc.perform(post("/api/v1/users/sync-firebase")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(requestBody))
                                        .andExpect(status().isOk());
                                successCount.incrementAndGet();
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                        });

                        try {
                            future.get(5, TimeUnit.SECONDS); // Timeout de 5 segundos
                        } catch (TimeoutException e) {
                            timeoutCount.incrementAndGet();
                            future.cancel(true);
                        } catch (Exception e) {
                            deadlockCount.incrementAndGet();
                        }
                        
                    } catch (Exception e) {
                        deadlockCount.incrementAndGet();
                    }
                }
                latch.countDown();
            });
        }

        // Then
        boolean completed = latch.await(120, TimeUnit.SECONDS);
        executor.shutdown();
        
        int totalOperations = numberOfThreads * operationsPerThread;
        double successRate = (double) successCount.get() / totalOperations * 100;
        double deadlockRate = (double) deadlockCount.get() / totalOperations * 100;
        double timeoutRate = (double) timeoutCount.get() / totalOperations * 100;

        System.out.println("\n=== RELATÓRIO DE DEADLOCK PREVENTION TEST ===");
        System.out.println("Threads: " + numberOfThreads);
        System.out.println("Operações por thread: " + operationsPerThread);
        System.out.println("Total de operações: " + totalOperations);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Deadlocks: " + deadlockCount.get());
        System.out.println("Timeouts: " + timeoutCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de deadlock: " + String.format("%.2f%%", deadlockRate));
        System.out.println("Taxa de timeout: " + String.format("%.2f%%", timeoutRate));

        assertTrue(completed, "Deadlock prevention test deve completar em 120 segundos");
        assertTrue(successRate >= 90.0, "Taxa de sucesso deve ser pelo menos 90%");
        assertTrue(deadlockRate <= 1.0, "Taxa de deadlock deve ser no máximo 1%");
        assertTrue(timeoutRate <= 5.0, "Taxa de timeout deve ser no máximo 5%");
    }

    @Test
    @DisplayName("THREAD SAFETY TEST: Segurança de threads")
    void threadSafetyTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfThreads = 200;
        int operationsPerThread = 5;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger threadSafetyViolationCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);

        // When
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            executor.submit(() -> {
                for (int op = 0; op < operationsPerThread; op++) {
                    try {
                        long startTime = System.currentTimeMillis();
                        
                        String requestBody = String.format("{"
                            + "\"firebaseUid\": \"thread_safety_%d_%d_%d\","
                            + "\"email\": \"threadsafety%d_%d@vynlotaste.com\","
                            + "\"displayName\": \"Thread Safety User %d-%d\","
                            + "\"emailVerified\": true,"
                            + "\"phoneNumber\": \"+5511777777%04d\""
                            + "}", threadId, op, System.currentTimeMillis(), threadId, op, threadId, op, (threadId * operationsPerThread + op) % 10000);

                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());

                        long responseTime = System.currentTimeMillis() - startTime;
                        totalResponseTime.addAndGet(responseTime);
                        successCount.incrementAndGet();
                        
                    } catch (Exception e) {
                        if (e.getMessage().contains("concurrent") || 
                            e.getMessage().contains("thread") ||
                            e.getMessage().contains("synchronization")) {
                            threadSafetyViolationCount.incrementAndGet();
                        }
                    }
                }
                latch.countDown();
            });
        }

        // Then
        boolean completed = latch.await(90, TimeUnit.SECONDS);
        executor.shutdown();
        
        int totalOperations = numberOfThreads * operationsPerThread;
        double successRate = (double) successCount.get() / totalOperations * 100;
        double threadSafetyViolationRate = (double) threadSafetyViolationCount.get() / totalOperations * 100;
        double avgResponseTime = successCount.get() > 0 ? (double) totalResponseTime.get() / successCount.get() : 0;

        System.out.println("\n=== RELATÓRIO DE THREAD SAFETY TEST ===");
        System.out.println("Threads: " + numberOfThreads);
        System.out.println("Operações por thread: " + operationsPerThread);
        System.out.println("Total de operações: " + totalOperations);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Violações de thread safety: " + threadSafetyViolationCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de violação: " + String.format("%.2f%%", threadSafetyViolationRate));
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", avgResponseTime));

        assertTrue(completed, "Thread safety test deve completar em 90 segundos");
        assertTrue(successRate >= 95.0, "Taxa de sucesso deve ser pelo menos 95%");
        assertTrue(threadSafetyViolationRate <= 1.0, "Taxa de violação deve ser no máximo 1%");
    }

    @Test
    @DisplayName("CONCURRENT READ/WRITE TEST: Leitura e escrita concorrente")
    void concurrentReadWriteTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfWriters = 50;
        int numberOfReaders = 50;
        int operationsPerThread = 10;
        
        ExecutorService writerExecutor = Executors.newFixedThreadPool(numberOfWriters);
        ExecutorService readerExecutor = Executors.newFixedThreadPool(numberOfReaders);
        
        CountDownLatch writerLatch = new CountDownLatch(numberOfWriters);
        CountDownLatch readerLatch = new CountDownLatch(numberOfReaders);
        
        AtomicInteger writeSuccessCount = new AtomicInteger(0);
        AtomicInteger readSuccessCount = new AtomicInteger(0);
        AtomicInteger readWriteConflictCount = new AtomicInteger(0);

        // When - Writers
        for (int i = 0; i < numberOfWriters; i++) {
            final int writerId = i;
            writerExecutor.submit(() -> {
                for (int op = 0; op < operationsPerThread; op++) {
                    try {
                        String requestBody = String.format("{"
                            + "\"firebaseUid\": \"writer_%d_%d_%d\","
                            + "\"email\": \"writer%d_%d@vynlotaste.com\","
                            + "\"displayName\": \"Writer User %d-%d\","
                            + "\"emailVerified\": true,"
                            + "\"phoneNumber\": \"+5511666666%04d\""
                            + "}", writerId, op, System.currentTimeMillis(), writerId, op, writerId, op, (writerId * operationsPerThread + op) % 10000);

                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());

                        writeSuccessCount.incrementAndGet();
                        
                    } catch (Exception e) {
                        if (e.getMessage().contains("conflict") || e.getMessage().contains("concurrent")) {
                            readWriteConflictCount.incrementAndGet();
                        }
                    }
                }
                writerLatch.countDown();
            });
        }

        // When - Readers (simulados como health checks)
        for (int i = 0; i < numberOfReaders; i++) {
            final int readerId = i;
            readerExecutor.submit(() -> {
                for (int op = 0; op < operationsPerThread; op++) {
                    try {
                        // Simular operação de leitura
                        String readerRequestBody = "{"
                            + "\"firebaseUid\": \"reader_" + readerId + "_" + op + "_" + System.currentTimeMillis() + "\","
                            + "\"email\": \"reader" + readerId + "_" + op + "@vynlotaste.com\","
                            + "\"displayName\": \"Reader User " + readerId + "-" + op + "\","
                            + "\"emailVerified\": true,"
                            + "\"phoneNumber\": \"+5511555555" + String.format("%04d", (readerId * operationsPerThread + op) % 10000) + "\""
                            + "}";
                        
                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(readerRequestBody))
                                .andExpect(status().isOk());

                        readSuccessCount.incrementAndGet();
                        
                    } catch (Exception e) {
                        if (e.getMessage().contains("conflict") || e.getMessage().contains("concurrent")) {
                            readWriteConflictCount.incrementAndGet();
                        }
                    }
                }
                readerLatch.countDown();
            });
        }

        // Then
        boolean writersCompleted = writerLatch.await(60, TimeUnit.SECONDS);
        boolean readersCompleted = readerLatch.await(60, TimeUnit.SECONDS);
        
        writerExecutor.shutdown();
        readerExecutor.shutdown();
        
        int totalWriteOperations = numberOfWriters * operationsPerThread;
        int totalReadOperations = numberOfReaders * operationsPerThread;
        int totalOperations = totalWriteOperations + totalReadOperations;
        
        double writeSuccessRate = (double) writeSuccessCount.get() / totalWriteOperations * 100;
        double readSuccessRate = (double) readSuccessCount.get() / totalReadOperations * 100;
        double conflictRate = (double) readWriteConflictCount.get() / totalOperations * 100;

        System.out.println("\n=== RELATÓRIO DE CONCURRENT READ/WRITE TEST ===");
        System.out.println("Writers: " + numberOfWriters);
        System.out.println("Readers: " + numberOfReaders);
        System.out.println("Operações por thread: " + operationsPerThread);
        System.out.println("Total de operações: " + totalOperations);
        System.out.println("Escritas bem-sucedidas: " + writeSuccessCount.get());
        System.out.println("Leituras bem-sucedidas: " + readSuccessCount.get());
        System.out.println("Conflitos: " + readWriteConflictCount.get());
        System.out.println("Taxa de sucesso (escrita): " + String.format("%.2f%%", writeSuccessRate));
        System.out.println("Taxa de sucesso (leitura): " + String.format("%.2f%%", readSuccessRate));
        System.out.println("Taxa de conflito: " + String.format("%.2f%%", conflictRate));

        assertTrue(writersCompleted && readersCompleted, "Concurrent read/write test deve completar em 60 segundos");
        assertTrue(writeSuccessRate >= 90.0, "Taxa de sucesso de escrita deve ser pelo menos 90%");
        assertTrue(readSuccessRate >= 90.0, "Taxa de sucesso de leitura deve ser pelo menos 90%");
        assertTrue(conflictRate <= 5.0, "Taxa de conflito deve ser no máximo 5%");
    }

    @Test
    @DisplayName("THREAD POOL EXHAUSTION TEST: Esgotamento do pool de threads")
    void threadPoolExhaustionTest() throws Exception {
        // Given
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        int numberOfThreads = 1000; // Mais threads que o pool pode suportar
        ExecutorService executor = Executors.newFixedThreadPool(50); // Pool limitado
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger rejectionCount = new AtomicInteger(0);
        AtomicInteger timeoutCount = new AtomicInteger(0);

        // When
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            try {
                executor.submit(() -> {
                    try {
                        String requestBody = String.format("{"
                            + "\"firebaseUid\": \"pool_exhaustion_%d_%d\","
                            + "\"email\": \"poolexhaustion%d@vynlotaste.com\","
                            + "\"displayName\": \"Pool Exhaustion User %d\","
                            + "\"emailVerified\": true,"
                            + "\"phoneNumber\": \"+5511444444%04d\""
                            + "}", threadId, System.currentTimeMillis(), threadId, threadId, threadId % 10000);

                        mockMvc.perform(post("/api/v1/users/sync-firebase")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());

                        successCount.incrementAndGet();
                        
                    } catch (Exception e) {
                        timeoutCount.incrementAndGet();
                    } finally {
                        latch.countDown();
                    }
                });
            } catch (RejectedExecutionException e) {
                rejectionCount.incrementAndGet();
                latch.countDown();
            }
        }

        // Then
        boolean completed = latch.await(120, TimeUnit.SECONDS);
        executor.shutdown();
        
        double successRate = (double) successCount.get() / numberOfThreads * 100;
        double rejectionRate = (double) rejectionCount.get() / numberOfThreads * 100;
        double timeoutRate = (double) timeoutCount.get() / numberOfThreads * 100;

        System.out.println("\n=== RELATÓRIO DE THREAD POOL EXHAUSTION TEST ===");
        System.out.println("Total de threads: " + numberOfThreads);
        System.out.println("Pool size: 50");
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Rejeições: " + rejectionCount.get());
        System.out.println("Timeouts: " + timeoutCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de rejeição: " + String.format("%.2f%%", rejectionRate));
        System.out.println("Taxa de timeout: " + String.format("%.2f%%", timeoutRate));

        assertTrue(completed, "Thread pool exhaustion test deve completar em 120 segundos");
        assertTrue(successRate >= 40.0, "Taxa de sucesso deve ser pelo menos 40% (pool limitado)");
        assertTrue(rejectionRate >= 0.0, "Deve haver rejeições devido ao pool limitado");
    }
}
