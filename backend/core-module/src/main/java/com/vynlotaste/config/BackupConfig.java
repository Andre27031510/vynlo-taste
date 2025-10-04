package com.vynlotaste.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Component
@ConfigurationProperties(prefix = "backup")
public class BackupConfig {
    
    private boolean backupEnabled = true;
    private String backupDirectory = "/app/backups";
    private int retentionDays = 7;
    private String databaseUrl = "jdbc:postgresql://postgres:5432/vynlotaste";
    private String databaseUsername = "vynlo_user";
    private String databasePassword = "96043020";
    
    public String getBackupFilePath() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        return backupDirectory + "/vynlotaste_backup_" + timestamp + ".sql";
    }
}