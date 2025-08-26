# Monitor de Sistema Simplificado
param(
    [int]$Duration = 60,
    [int]$Interval = 5
)

Write-Host "MONITORAMENTO DE SISTEMA - VYNLO TASTE" -ForegroundColor Green
Write-Host "Duracao: $Duration segundos" -ForegroundColor Yellow
Write-Host ""

$logFile = "performance-$(Get-Date -Format 'yyyyMMdd-HHmmss').csv"
"Timestamp,CPU_Percent,Memory_MB,Memory_Percent" | Out-File -FilePath $logFile -Encoding UTF8

Write-Host "Coletando metricas..." -ForegroundColor Cyan
Write-Host "Log: $logFile" -ForegroundColor Gray
Write-Host ""

$startTime = Get-Date
$endTime = $startTime.AddSeconds($Duration)

while ((Get-Date) -lt $endTime) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    try {
        # CPU
        $cpu = Get-Counter "\Processor(_Total)\% Processor Time" -SampleInterval 1 -MaxSamples 1 -ErrorAction SilentlyContinue
        $cpuPercent = if ($cpu) { [math]::Round($cpu.CounterSamples[0].CookedValue, 2) } else { 0 }
        
        # Memoria
        $memory = Get-Counter "\Memory\Available MBytes" -SampleInterval 1 -MaxSamples 1 -ErrorAction SilentlyContinue
        $totalMemory = (Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue).TotalPhysicalMemory / 1MB
        $availableMemory = if ($memory) { $memory.CounterSamples[0].CookedValue } else { 0 }
        $usedMemory = [math]::Round($totalMemory - $availableMemory, 2)
        $memoryPercent = if ($totalMemory -gt 0) { [math]::Round(($usedMemory / $totalMemory) * 100, 2) } else { 0 }
        
        # Log
        "$timestamp,$cpuPercent,$usedMemory,$memoryPercent" | Out-File -FilePath $logFile -Append -Encoding UTF8
        
        # Display
        Write-Host "[$timestamp] CPU: $cpuPercent% | RAM: $memoryPercent% ($usedMemory MB)" -ForegroundColor White
        
    } catch {
        Write-Host "[$timestamp] Erro na coleta de metricas" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds $Interval
}

Write-Host ""
Write-Host "Monitoramento concluido!" -ForegroundColor Green
Write-Host "Log salvo em: $logFile" -ForegroundColor Yellow