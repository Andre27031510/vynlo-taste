package com.vynlotaste.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Configuration
@EnableScheduling
public class BackupConfig {

    @Value("${backup.enabled:false}")
    private boolean backupEnabled;

    @Value("${backup.schedule:0 0 2 * * *}")
    private String backupSchedule;

    @Value("${backup.retention-days:30}")
    private int retentionDays;

    @Value("${backup.directory:backups}")
    private String backupDirectory;

    @Value("${spring.datasource.url:}")
    private String databaseUrl;

    @Value("${spring.datasource.username:}")
    private String databaseUsername;

    @Value("${spring.datasource.password:}")
    private String databasePassword;

    @Bean
    public String initializeBackupDirectory() {
        if (backupEnabled) {
            File backupDir = new File(backupDirectory);
            if (!backupDir.exists()) {
                if (backupDir.mkdirs()) {
                    log.info("Diretório de backup criado: {}", backupDirectory);
                } else {
                    log.error("Falha ao criar diretório de backup: {}", backupDirectory);
                }
            }
        }
        return backupDirectory;
    }

    public String getBackupFileName() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        return String.format("vynlotaste_backup_%s.sql", timestamp);
    }

    public String getBackupFilePath() {
        return backupDirectory + File.separator + getBackupFileName();
    }

    public boolean isBackupEnabled() {
        return backupEnabled;
    }

    public String getBackupSchedule() {
        return backupSchedule;
    }

    public int getRetentionDays() {
        return retentionDays;
    }

    public String getBackupDirectory() {
        return backupDirectory;
    }

    public String getDatabaseUrl() {
        return databaseUrl;
    }

    public String getDatabaseUsername() {
        return databaseUsername;
    }

    public String getDatabasePassword() {
        return databasePassword;
    }
}
