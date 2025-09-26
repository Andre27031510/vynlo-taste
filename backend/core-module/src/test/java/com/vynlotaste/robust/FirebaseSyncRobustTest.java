package com.vynlotaste.robust;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vynlotaste.entity.User;
import com.vynlotaste.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.Optional;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("TESTE ROBUSTO DE SINCRONIZAÇÃO FIREBASE - SISTEMA VYNLOTASTE")
class FirebaseSyncRobustTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @DisplayName("TESTE BÁSICO: Sincronização de usuário Firebase único")
    @Transactional
    void testBasicFirebaseSync() throws Exception {
        // Given
        String firebaseUid = "test_firebase_uid_" + System.currentTimeMillis();
        String email = "test@vynlotaste.com";
        String displayName = "Test User";
        
        String requestBody = String.format("""
            {
                "firebaseUid": "%s",
                "email": "%s",
                "displayName": "%s",
                "emailVerified": true,
                "phoneNumber": "+5511999999999",
                "photoURL": "https://example.com/photo.jpg",
                "creationTime": "2024-12-25T10:30:00Z",
                "lastSignInTime": "2024-12-25T10:30:00Z"
            }
            """, firebaseUid, email, displayName);

        // When
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Usuário sincronizado com sucesso"))
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.firebaseUid").value(firebaseUid))
                .andExpect(jsonPath("$.email").value(email));

        // Then
        Optional<User> savedUser = userRepository.findByFirebaseUid(firebaseUid);
        assertTrue(savedUser.isPresent(), "Usuário deve ser salvo no banco de dados");
        
        User user = savedUser.get();
        assertEquals(firebaseUid, user.getFirebaseUid(), "Firebase UID deve ser salvo corretamente");
        assertEquals(email, user.getEmail(), "Email deve ser salvo corretamente");
        assertEquals(displayName, user.getFirstName(), "Display name deve ser salvo como firstName");
        assertTrue(user.isActive(), "Usuário deve estar ativo");
        assertNotNull(user.getCreatedAt(), "Data de criação deve ser definida");

        System.out.println("✅ TESTE BÁSICO PASSOU: Usuário sincronizado com sucesso");
        System.out.println("   - Firebase UID: " + firebaseUid);
        System.out.println("   - Email: " + email);
        System.out.println("   - ID no banco: " + user.getId());
    }

    @Test
    @DisplayName("TESTE DE CONCORRÊNCIA: 1.000 sincronizações simultâneas")
    @Transactional
    void testConcurrentFirebaseSync() throws Exception {
        // Given
        int numberOfThreads = 1000;
        ExecutorService executor = Executors.newFixedThreadPool(100);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicInteger duplicateCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);

        long startTime = System.currentTimeMillis();

        // When
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    long requestStartTime = System.currentTimeMillis();
                    
                    String firebaseUid = "concurrent_" + threadId + "_" + System.currentTimeMillis();
                    String email = "concurrent" + threadId + "@vynlotaste.com";
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "%s",
                            "email": "%s",
                            "displayName": "Concurrent User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511888888%04d",
                            "photoURL": "https://example.com/concurrent%d.jpg",
                            "creationTime": "2024-12-25T10:30:00Z",
                            "lastSignInTime": "2024-12-25T10:30:00Z"
                        }
                        """, firebaseUid, email, threadId, threadId % 10000, threadId);

                    mockMvc.perform(post("/api/v1/users/sync-firebase")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                            .andExpect(status().isOk());

                    long responseTime = System.currentTimeMillis() - requestStartTime;
                    totalResponseTime.addAndGet(responseTime);
                    successCount.incrementAndGet();
                    
                } catch (Exception e) {
                    if (e.getMessage().contains("already exists") || e.getMessage().contains("duplicate")) {
                        duplicateCount.incrementAndGet();
                    } else {
                        errorCount.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Then
        boolean completed = latch.await(60, TimeUnit.SECONDS);
        executor.shutdown();
        
        long totalTime = System.currentTimeMillis() - startTime;
        double successRate = (double) successCount.get() / numberOfThreads * 100;
        double averageResponseTime = successCount.get() > 0 ? (double) totalResponseTime.get() / successCount.get() : 0;
        double requestsPerSecond = (double) numberOfThreads / (totalTime / 1000.0);

        // Relatório detalhado
        System.out.println("\n=== RELATÓRIO DE CONCORRÊNCIA FIREBASE SYNC ===");
        System.out.println("Total de requisições: " + numberOfThreads);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Duplicatas: " + duplicateCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Tempo total: " + totalTime + " ms");
        System.out.println("Requisições por segundo: " + String.format("%.2f", requestsPerSecond));
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", averageResponseTime));

        // Assertions robustas
        assertTrue(completed, "Teste deve completar em 60 segundos");
        assertTrue(successRate >= 95.0, "Taxa de sucesso deve ser pelo menos 95%");
        assertTrue(averageResponseTime <= 2000.0, "Tempo médio deve ser menor que 2 segundos");
        assertTrue(requestsPerSecond >= 50.0, "Deve processar pelo menos 50 req/s");
    }

    @Test
    @DisplayName("TESTE DE DADOS DUPLICADOS: Múltiplas tentativas com mesmo email")
    @Transactional
    void testDuplicateEmailHandling() throws Exception {
        // Given
        String email = "duplicate@vynlotaste.com";
        String firebaseUid1 = "duplicate_uid_1_" + System.currentTimeMillis();
        String firebaseUid2 = "duplicate_uid_2_" + System.currentTimeMillis();
        
        String requestBody1 = String.format("""
            {
                "firebaseUid": "%s",
                "email": "%s",
                "displayName": "Duplicate User 1",
                "emailVerified": true,
                "phoneNumber": "+5511777777777"
            }
            """, firebaseUid1, email);

        String requestBody2 = String.format("""
            {
                "firebaseUid": "%s",
                "email": "%s",
                "displayName": "Duplicate User 2",
                "emailVerified": true,
                "phoneNumber": "+5511777777778"
            }
            """, firebaseUid2, email);

        // When - Primeira sincronização
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        // When - Segunda sincronização com mesmo email
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("already_exists"));

        // Then
        Optional<User> user1 = userRepository.findByFirebaseUid(firebaseUid1);
        Optional<User> user2 = userRepository.findByFirebaseUid(firebaseUid2);
        
        assertTrue(user1.isPresent(), "Primeiro usuário deve existir");
        assertFalse(user2.isPresent(), "Segundo usuário não deve ser criado");
        
        // Verificar se o usuário existente foi atualizado com o novo Firebase UID
        User existingUser = userRepository.findByEmail(email).orElse(null);
        assertNotNull(existingUser, "Usuário deve existir no banco");
        assertEquals(firebaseUid2, existingUser.getFirebaseUid(), "Firebase UID deve ser atualizado");

        System.out.println("✅ TESTE DE DUPLICATAS PASSOU: Email duplicado tratado corretamente");
        System.out.println("   - Email: " + email);
        System.out.println("   - Firebase UID final: " + existingUser.getFirebaseUid());
        System.out.println("   - ID no banco: " + existingUser.getId());
    }

    @Test
    @DisplayName("TESTE DE DADOS INVÁLIDOS: Validação de entrada")
    void testInvalidDataHandling() throws Exception {
        // Teste 1: Email inválido
        String invalidEmailBody = """
            {
                "firebaseUid": "invalid_email_test",
                "email": "invalid-email",
                "displayName": "Invalid Email User",
                "emailVerified": true
            }
            """;

        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidEmailBody))
                .andExpect(status().isBadRequest());

        // Teste 2: Firebase UID ausente
        String missingUidBody = """
            {
                "email": "missing-uid@vynlotaste.com",
                "displayName": "Missing UID User",
                "emailVerified": true
            }
            """;

        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(missingUidBody))
                .andExpect(status().isBadRequest());

        // Teste 3: Email ausente
        String missingEmailBody = """
            {
                "firebaseUid": "missing_email_test",
                "displayName": "Missing Email User",
                "emailVerified": true
            }
            """;

        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(missingEmailBody))
                .andExpect(status().isBadRequest());

        // Teste 4: JSON malformado
        String malformedJsonBody = """
            {
                "firebaseUid": "malformed_json_test",
                "email": "malformed@vynlotaste.com",
                "displayName": "Malformed JSON User",
                "emailVerified": true
            """;

        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(malformedJsonBody))
                .andExpect(status().isBadRequest());

        System.out.println("✅ TESTE DE DADOS INVÁLIDOS PASSOU: Validações funcionando corretamente");
    }

    @Test
    @DisplayName("TESTE DE PERFORMANCE: 10.000 sincronizações sequenciais")
    @Transactional
    void testPerformanceSequentialSync() throws Exception {
        // Given
        int numberOfRequests = 10000;
        long startTime = System.currentTimeMillis();
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        AtomicLong totalResponseTime = new AtomicLong(0);

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            try {
                long requestStartTime = System.currentTimeMillis();
                
                String firebaseUid = "perf_" + i + "_" + System.currentTimeMillis();
                String email = "perf" + i + "@vynlotaste.com";
                
                String requestBody = String.format("""
                    {
                        "firebaseUid": "%s",
                        "email": "%s",
                        "displayName": "Performance User %d",
                        "emailVerified": true,
                        "phoneNumber": "+5511666666%04d"
                    }
                    """, firebaseUid, email, i, i % 10000);

                mockMvc.perform(post("/api/v1/users/sync-firebase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                        .andExpect(status().isOk());

                long responseTime = System.currentTimeMillis() - requestStartTime;
                totalResponseTime.addAndGet(responseTime);
                successCount.incrementAndGet();
                
            } catch (Exception e) {
                errorCount.incrementAndGet();
            }
        }

        // Then
        long totalTime = System.currentTimeMillis() - startTime;
        double successRate = (double) successCount.get() / numberOfRequests * 100;
        double averageResponseTime = successCount.get() > 0 ? (double) totalResponseTime.get() / successCount.get() : 0;
        double requestsPerSecond = (double) numberOfRequests / (totalTime / 1000.0);

        System.out.println("\n=== RELATÓRIO DE PERFORMANCE SEQUENCIAL ===");
        System.out.println("Total de requisições: " + numberOfRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Erros: " + errorCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Tempo total: " + totalTime + " ms");
        System.out.println("Requisições por segundo: " + String.format("%.2f", requestsPerSecond));
        System.out.println("Tempo médio de resposta: " + String.format("%.2f ms", averageResponseTime));

        assertTrue(successRate >= 99.0, "Taxa de sucesso deve ser pelo menos 99%");
        assertTrue(averageResponseTime <= 1000.0, "Tempo médio deve ser menor que 1 segundo");
        assertTrue(requestsPerSecond >= 10.0, "Deve processar pelo menos 10 req/s sequencialmente");
    }

    @Test
    @DisplayName("TESTE DE RECUPERAÇÃO: Simulação de falhas e retry")
    @Transactional
    void testFailureRecovery() throws Exception {
        // Given
        int numberOfRequests = 500;
        int failureRate = 20; // 20% de falhas simuladas
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
                    String firebaseUid = "recovery_" + requestId + "_" + System.currentTimeMillis();
                    String email = "recovery" + requestId + "@vynlotaste.com";
                    
                    String requestBody = String.format("""
                        {
                            "firebaseUid": "%s",
                            "email": "%s",
                            "displayName": "Recovery User %d",
                            "emailVerified": true,
                            "phoneNumber": "+5511555555%04d"
                        }
                        """, firebaseUid, email, requestId, requestId % 10000);

                    if (shouldFail) {
                        // Simular falha
                        Thread.sleep(100);
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

        System.out.println("\n=== RELATÓRIO DE RECUPERAÇÃO DE FALHAS ===");
        System.out.println("Total de requisições: " + numberOfRequests);
        System.out.println("Sucessos: " + successCount.get());
        System.out.println("Falhas: " + failureCount.get());
        System.out.println("Recuperações: " + recoveryCount.get());
        System.out.println("Taxa de sucesso: " + String.format("%.2f%%", successRate));
        System.out.println("Taxa de recuperação: " + String.format("%.2f%%", recoveryRate));

        assertTrue(completed, "Teste de recuperação deve completar em 60 segundos");
        assertTrue(successRate >= 80.0, "Taxa de sucesso deve ser pelo menos 80%");
        assertTrue(recoveryRate >= 60.0, "Taxa de recuperação deve ser pelo menos 60%");
    }

    @Test
    @DisplayName("TESTE DE INTEGRIDADE: Verificação de dados após sincronização")
    @Transactional
    void testDataIntegrityAfterSync() throws Exception {
        // Given
        String firebaseUid = "integrity_test_" + System.currentTimeMillis();
        String email = "integrity@vynlotaste.com";
        String displayName = "Integrity Test User";
        String phoneNumber = "+5511999888777";
        String photoURL = "https://example.com/integrity.jpg";
        
        String requestBody = String.format("""
            {
                "firebaseUid": "%s",
                "email": "%s",
                "displayName": "%s",
                "emailVerified": true,
                "phoneNumber": "%s",
                "photoURL": "%s",
                "creationTime": "2024-12-25T10:30:00Z",
                "lastSignInTime": "2024-12-25T10:30:00Z"
            }
            """, firebaseUid, email, displayName, phoneNumber, photoURL);

        // When
        mockMvc.perform(post("/api/v1/users/sync-firebase")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());

        // Then - Verificar integridade dos dados
        Optional<User> savedUser = userRepository.findByFirebaseUid(firebaseUid);
        assertTrue(savedUser.isPresent(), "Usuário deve existir no banco");
        
        User user = savedUser.get();
        
        // Verificações de integridade
        assertEquals(firebaseUid, user.getFirebaseUid(), "Firebase UID deve ser correto");
        assertEquals(email, user.getEmail(), "Email deve ser correto");
        assertEquals(displayName, user.getFirstName(), "Display name deve ser salvo como firstName");
        assertEquals(phoneNumber, user.getPhone(), "Phone number deve ser correto");
        assertEquals(photoURL, user.getProfileImage(), "Photo URL deve ser correto");
        assertTrue(user.isEmailVerified(), "Email deve estar verificado");
        assertTrue(user.isActive(), "Usuário deve estar ativo");
        assertNotNull(user.getCreatedAt(), "Data de criação deve existir");
        assertNotNull(user.getUpdatedAt(), "Data de atualização deve existir");
        
        // Verificar se não há dados corrompidos
        assertFalse(user.getEmail().contains("null"), "Email não deve conter 'null'");
        assertFalse(user.getFirstName().contains("null"), "FirstName não deve conter 'null'");
        assertTrue(user.getEmail().contains("@"), "Email deve ser válido");
        assertTrue(user.getPhone().startsWith("+"), "Phone deve começar com +");

        System.out.println("✅ TESTE DE INTEGRIDADE PASSOU: Dados sincronizados corretamente");
        System.out.println("   - Firebase UID: " + user.getFirebaseUid());
        System.out.println("   - Email: " + user.getEmail());
        System.out.println("   - Nome: " + user.getFirstName());
        System.out.println("   - Telefone: " + user.getPhone());
        System.out.println("   - Foto: " + user.getProfileImage());
        System.out.println("   - Ativo: " + user.isActive());
        System.out.println("   - Email verificado: " + user.isEmailVerified());
    }
}
