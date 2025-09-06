package com.vynlotaste.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import org.springframework.util.StringUtils;

import javax.sql.DataSource;

/**
 * Configuração de Banco de Dados Otimizada para Alta Performance
 * Suporta múltiplos ambientes e configurações flexíveis
 */
@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:}")
    private String jdbcUrl;
    
    @Value("${spring.datasource.username:postgres}")
    private String username;
    
    @Value("${spring.datasource.password:}")
    private String password;
    
    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;
    
    @Value("${spring.datasource.hikari.maximum-pool-size:20}")
    private int maximumPoolSize;
    
    @Value("${spring.datasource.hikari.minimum-idle:5}")
    private int minimumIdle;
    
    @Value("${spring.datasource.hikari.connection-timeout:30000}")
    private long connectionTimeout;

    @Bean
    @Primary
    @ConditionalOnProperty(name = "spring.datasource.url")
    public DataSource dataSource() {
        if (!StringUtils.hasText(jdbcUrl)) {
            throw new IllegalStateException("spring.datasource.url deve ser configurada");
        }
        
        HikariConfig config = new HikariConfig();
        
        // Configurações essenciais
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        
        // Configurar driver apenas se especificado
        if (StringUtils.hasText(driverClassName)) {
            try {
                Class.forName(driverClassName);
                config.setDriverClassName(driverClassName);
            } catch (ClassNotFoundException e) {
                // Log warning mas continue - HikariCP pode detectar automaticamente
                System.err.println("Driver " + driverClassName + " não encontrado, usando detecção automática");
            }
        }
        
        // Configurações de pool otimizadas
        config.setMaximumPoolSize(maximumPoolSize);
        config.setMinimumIdle(minimumIdle);
        config.setConnectionTimeout(connectionTimeout);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        config.setLeakDetectionThreshold(60000);
        
        // Configurações específicas para PostgreSQL
        if (jdbcUrl.contains("postgresql")) {
            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            config.addDataSourceProperty("useServerPrepStmts", "true");
            config.addDataSourceProperty("reWriteBatchedInserts", "true");
        }
        
        // Pool name para identificação
        config.setPoolName("VynloTasteCP");
        
        return new HikariDataSource(config);
    }
}
