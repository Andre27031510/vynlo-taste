package com.vynlotaste.service;

import com.vynlotaste.config.BackupConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class BackupService {

    private final BackupConfig backupConfig;

    @Scheduled(cron = "${backup.schedule:0 0 2 * * *}")
    public void performScheduledBackup() {
        if (!backupConfig.isBackupEnabled()) {
            log.debug("Backup automático desabilitado");
            return;
        }

        try {
            log.info("Iniciando backup automático do banco de dados");
            performBackup();
            cleanupOldBackups();
            log.info("Backup automático concluído com sucesso");
        } catch (Exception e) {
            log.error("Erro durante backup automático", e);
        }
    }

    public void performBackup() throws IOException, InterruptedException {
        String backupFilePath = backupConfig.getBackupFilePath();
        String databaseUrl = backupConfig.getDatabaseUrl();
        String username = backupConfig.getDatabaseUsername();
        String password = backupConfig.getDatabasePassword();

        // Extrair informações do banco da URL
        String host = extractHostFromUrl(databaseUrl);
        String port = extractPortFromUrl(databaseUrl);
        String database = extractDatabaseFromUrl(databaseUrl);

        // Comando pg_dump para PostgreSQL
        ProcessBuilder processBuilder = new ProcessBuilder(
            "pg_dump",
            "-h", host,
            "-p", port,
            "-U", username,
            "-d", database,
            "-f", backupFilePath,
            "--verbose",
            "--no-password"
        );

        // Configurar variáveis de ambiente
        processBuilder.environment().put("PGPASSWORD", password);

        // Configurar diretório de trabalho
        processBuilder.directory(new File(backupConfig.getBackupDirectory()));

        log.info("Executando backup para: {}", backupFilePath);
        Process process = processBuilder.start();

        // Aguardar conclusão
        int exitCode = process.waitFor();

        if (exitCode == 0) {
            File backupFile = new File(backupFilePath);
            long fileSize = backupFile.length();
            log.info("Backup concluído com sucesso. Arquivo: {} ({} bytes)", backupFilePath, fileSize);
        } else {
            log.error("Backup falhou com código de saída: {}", exitCode);
            throw new RuntimeException("Falha no backup do banco de dados");
        }
    }

    public void cleanupOldBackups() {
        try {
            Path backupDir = Paths.get(backupConfig.getBackupDirectory());
            int retentionDays = backupConfig.getRetentionDays();
            LocalDateTime cutoffDate = LocalDateTime.now().minus(retentionDays, ChronoUnit.DAYS);

            try (Stream<Path> paths = Files.walk(backupDir, 1)) {
                paths
                    .filter(Files::isRegularFile)
                    .filter(path -> path.toString().endsWith(".sql"))
                    .filter(path -> {
                        try {
                            LocalDateTime fileDate = extractDateFromFileName(path.getFileName().toString());
                            return fileDate.isBefore(cutoffDate);
                        } catch (Exception e) {
                            log.warn("Não foi possível extrair data do arquivo: {}", path);
                            return false;
                        }
                    })
                    .forEach(this::deleteBackupFile);
            }

            log.info("Limpeza de backups antigos concluída");
        } catch (Exception e) {
            log.error("Erro durante limpeza de backups antigos", e);
        }
    }

    private String extractHostFromUrl(String databaseUrl) {
        // jdbc:postgresql://localhost:5432/vynlotaste
        String[] parts = databaseUrl.split("://");
        if (parts.length > 1) {
            String[] hostPort = parts[1].split("/")[0].split(":");
            return hostPort[0];
        }
        return "localhost";
    }

    private String extractPortFromUrl(String databaseUrl) {
        // jdbc:postgresql://localhost:5432/vynlotaste
        String[] parts = databaseUrl.split("://");
        if (parts.length > 1) {
            String[] hostPort = parts[1].split("/")[0].split(":");
            return hostPort.length > 1 ? hostPort[1] : "5432";
        }
        return "5432";
    }

    private String extractDatabaseFromUrl(String databaseUrl) {
        // jdbc:postgresql://localhost:5432/vynlotaste
        String[] parts = databaseUrl.split("/");
        return parts[parts.length - 1];
    }

    private LocalDateTime extractDateFromFileName(String fileName) {
        // vynlotaste_backup_20241201_143022.sql
        try {
            String datePart = fileName.replace("vynlotaste_backup_", "").replace(".sql", "");
            String[] dateTime = datePart.split("_");
            String date = dateTime[0];
            String time = dateTime[1];
            
            int year = Integer.parseInt(date.substring(0, 4));
            int month = Integer.parseInt(date.substring(4, 6));
            int day = Integer.parseInt(date.substring(6, 8));
            int hour = Integer.parseInt(time.substring(0, 2));
            int minute = Integer.parseInt(time.substring(2, 4));
            int second = Integer.parseInt(time.substring(4, 6));
            
            return LocalDateTime.of(year, month, day, hour, minute, second);
        } catch (Exception e) {
            log.warn("Formato de nome de arquivo inválido: {}", fileName);
            return LocalDateTime.now();
        }
    }

    private void deleteBackupFile(Path filePath) {
        try {
            Files.delete(filePath);
            log.info("Backup antigo removido: {}", filePath);
        } catch (IOException e) {
            log.error("Erro ao remover backup antigo: {}", filePath, e);
        }
    }

    public void performManualBackup() throws IOException, InterruptedException {
        log.info("Iniciando backup manual do banco de dados");
        performBackup();
        log.info("Backup manual concluído com sucesso");
    }
}
