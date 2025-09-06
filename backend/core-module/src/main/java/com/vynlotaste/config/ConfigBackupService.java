package com.vynlotaste.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConfigBackupService {

    private final VynloProperties vynloProperties;
    private final Environment environment;
    private final ObjectMapper objectMapper;

    @EventListener(ApplicationReadyEvent.class)
    public void backupConfigOnStartup() {
        if (vynloProperties.getBackup().isEnabled()) {
            backupCurrentConfiguration();
        }
    }

    @Scheduled(cron = "${vynlo.backup.schedule:0 2 * * *}")
    public void scheduledBackup() {
        if (vynloProperties.getBackup().isEnabled()) {
            backupCurrentConfiguration();
        }
    }

    private void backupCurrentConfiguration() {
        try {
            Map<String, Object> config = new HashMap<>();
            
            // Backup de propriedades não sensíveis
            config.put("features", vynloProperties.getFeatures());
            config.put("rateLimit", vynloProperties.getRateLimit());
            config.put("cors", vynloProperties.getCors());
            config.put("activeProfiles", environment.getActiveProfiles());
            config.put("timestamp", LocalDateTime.now());
            
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = String.format("config-backup-%s.json", timestamp);
            
            Path backupDir = Paths.get("./config/backups");
            Files.createDirectories(backupDir);
            
            Path backupFile = backupDir.resolve(filename);
            objectMapper.writerWithDefaultPrettyPrinter()
                .writeValue(backupFile.toFile(), config);
            
            log.info("Configuration backup created: {}", backupFile);
            
            cleanupOldBackups(backupDir);
            
        } catch (IOException e) {
            log.error("Failed to backup configuration", e);
        }
    }

    private void cleanupOldBackups(Path backupDir) {
        try {
            int retentionDays = vynloProperties.getBackup().getRetentionDays();
            long cutoffTime = System.currentTimeMillis() - (retentionDays * 24L * 60L * 60L * 1000L);
            
            Files.list(backupDir)
                .filter(path -> path.toString().endsWith(".json"))
                .filter(path -> {
                    try {
                        return Files.getLastModifiedTime(path).toMillis() < cutoffTime;
                    } catch (IOException e) {
                        return false;
                    }
                })
                .forEach(path -> {
                    try {
                        Files.delete(path);
                        log.debug("Deleted old backup: {}", path);
                    } catch (IOException e) {
                        log.warn("Failed to delete old backup: {}", path, e);
                    }
                });
                
        } catch (IOException e) {
            log.warn("Failed to cleanup old backups", e);
        }
    }
}