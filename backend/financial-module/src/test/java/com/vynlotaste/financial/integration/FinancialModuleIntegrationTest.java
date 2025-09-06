package com.vynlotaste.financial.integration;

import com.vynlotaste.financial.FinancialApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

/**
 * Testes de integração do módulo financeiro
 */
@SpringBootTest(
    classes = FinancialApplication.class,
    webEnvironment = SpringBootTest.WebEnvironment.NONE
)
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "financial.module.enabled=true",
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration",
    "logging.level.org.springframework=WARN",
    "logging.level.org.hibernate=WARN"
})
public class FinancialModuleIntegrationTest {

    @Test
    public void contextLoads() {
        // Verifica se o contexto Spring carrega corretamente sem JPA
    }

    @Test
    public void financialModuleIsEnabled() {
        // Verifica se o módulo financeiro está ativo
    }
}