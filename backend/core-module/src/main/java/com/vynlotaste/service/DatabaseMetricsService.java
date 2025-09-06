package com.vynlotaste.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseMetricsService {

    private final MeterRegistry meterRegistry;
    private final DataSource dataSource;
    
    private final AtomicLong activeConnections = new AtomicLong(0);
    private final AtomicLong slowQueries = new AtomicLong(0);
    
    @PostConstruct
    public void initializeGauges() {
        Gauge.builder("vynlo.database.connections.active", activeConnections, AtomicLong::doubleValue)
            .description("Active database connections")
            .register(meterRegistry);
        
        Gauge.builder("vynlo.database.queries.slow", slowQueries, AtomicLong::doubleValue)
            .description("Slow database queries count")
            .register(meterRegistry);
    }



    public void recordQuery(String queryType, String table, long durationMs, boolean success) {
        Timer.builder("vynlo.database.query.duration")
            .description("Database query duration")
            .tag("type", queryType)
            .tag("table", table)
            .tag("success", String.valueOf(success))
            .register(meterRegistry)
            .record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        
        Counter.builder("vynlo.database.query.total")
            .description("Total database queries")
            .tag("type", queryType)
            .tag("table", table)
            .tag("success", String.valueOf(success))
            .register(meterRegistry)
            .increment();
        
        if (durationMs > 1000) { // Queries > 1s são lentas
            slowQueries.incrementAndGet();
            
            Counter.builder("vynlo.database.query.slow")
                .description("Slow database queries")
                .tag("type", queryType)
                .tag("table", table)
                .register(meterRegistry)
                .increment();
            
            log.warn("Slow query detected: {} on {} - Duration: {}ms", queryType, table, durationMs);
        }
        
        if (!success) {
            Counter.builder("vynlo.database.query.errors")
                .description("Database query errors")
                .tag("type", queryType)
                .tag("table", table)
                .register(meterRegistry)
                .increment();
        }
        
        log.debug("Query recorded: {} on {} - Duration: {}ms, Success: {}", 
            queryType, table, durationMs, success);
    }

    public void recordConnectionAcquired() {
        activeConnections.incrementAndGet();
        
        Counter.builder("vynlo.database.connections.acquired")
            .description("Database connections acquired")
            .register(meterRegistry)
            .increment();
    }

    public void recordConnectionReleased() {
        activeConnections.decrementAndGet();
        
        Counter.builder("vynlo.database.connections.released")
            .description("Database connections released")
            .register(meterRegistry)
            .increment();
    }

    public void recordTransactionCommitted(long durationMs) {
        Timer.builder("vynlo.database.transaction.duration")
            .description("Database transaction duration")
            .tag("result", "committed")
            .register(meterRegistry)
            .record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        
        Counter.builder("vynlo.database.transaction.total")
            .description("Total database transactions")
            .tag("result", "committed")
            .register(meterRegistry)
            .increment();
    }

    public void recordTransactionRolledBack(long durationMs) {
        Timer.builder("vynlo.database.transaction.duration")
            .description("Database transaction duration")
            .tag("result", "rolled_back")
            .register(meterRegistry)
            .record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        
        Counter.builder("vynlo.database.transaction.total")
            .description("Total database transactions")
            .tag("result", "rolled_back")
            .register(meterRegistry)
            .increment();
        
        log.warn("Transaction rolled back after {}ms", durationMs);
    }

    @Scheduled(fixedRate = 60000) // A cada minuto
    public void updateDatabaseMetrics() {
        try (Connection connection = dataSource.getConnection()) {
            // Métricas de conexões ativas
            updateConnectionPoolMetrics();
            
            // Métricas de tamanho das tabelas
            updateTableSizeMetrics(connection);
            
        } catch (Exception e) {
            log.error("Error updating database metrics", e);
        }
    }

    private void updateConnectionPoolMetrics() {
        try {
            // Assumindo HikariCP como pool de conexões
            if (dataSource instanceof com.zaxxer.hikari.HikariDataSource hikariDS) {
                Gauge.builder("vynlo.database.pool.active", hikariDS.getHikariPoolMXBean(), bean -> (double) bean.getActiveConnections())
                    .description("Active connections in pool")
                    .register(meterRegistry);
                
                Gauge.builder("vynlo.database.pool.idle", hikariDS.getHikariPoolMXBean(), bean -> (double) bean.getIdleConnections())
                    .description("Idle connections in pool")
                    .register(meterRegistry);
                
                Gauge.builder("vynlo.database.pool.total", hikariDS.getHikariPoolMXBean(), bean -> (double) bean.getTotalConnections())
                    .description("Total connections in pool")
                    .register(meterRegistry);
            }
        } catch (Exception e) {
            log.debug("Could not get connection pool metrics", e);
        }
    }

    private void updateTableSizeMetrics(Connection connection) {
        String[] tables = {"users", "orders", "products", "order_items"};
        
        for (String table : tables) {
            try (PreparedStatement stmt = connection.prepareStatement(
                "SELECT COUNT(*) FROM " + table)) {
                
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    long count = rs.getLong(1);
                    
                    Gauge.builder("vynlo.database.table.rows", count, Long::doubleValue)
                        .description("Number of rows in table")
                        .tag("table", table)
                        .register(meterRegistry);
                }
            } catch (Exception e) {
                log.debug("Could not get row count for table: {}", table, e);
            }
        }
    }
}