# Sistema de Monitoramento de Performance - Vynlo Taste
param(
    [int]$Duration = 300,  # 5 minutos por padrão
    [int]$Interval = 5     # 5 segundos entre coletas
)

Write-Host "🔍 MONITORAMENTO DE SISTEMA - VYNLO TASTE" -ForegroundColor Green
Write-Host "Duracao: $Duration segundos | Intervalo: $Interval segundos" -ForegroundColor Yellow
Write-Host ""

$logFile = "performance-monitor-$(Get-Date -Format 'yyyyMMdd-HHmmss').csv"
Write-Host "Log file: $logFile" -ForegroundColor Gray
$header = "Timestamp,CPU_Percent,Memory_MB,Memory_Percent,Disk_Read_MB,Disk_Write_MB,Network_In_MB,Network_Out_MB"
$header | Out-File -FilePath $logFile -Encoding UTF8

$startTime = Get-Date
$endTime = $startTime.AddSeconds($Duration)

Write-Host "Coletando metricas..." -ForegroundColor Cyan
Write-Host "Log: $logFile" -ForegroundColor Gray
Write-Host ""

while ((Get-Date) -lt $endTime) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # CPU
    $cpu = Get-Counter "\Processor(_Total)\% Processor Time" -SampleInterval 1 -MaxSamples 1
    $cpuPercent = [math]::Round($cpu.CounterSamples[0].CookedValue, 2)
    
    # Memória
    $memory = Get-Counter "\Memory\Available MBytes" -SampleInterval 1 -MaxSamples 1
    $totalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1MB
    $availableMemory = $memory.CounterSamples[0].CookedValue
    $usedMemory = [math]::Round($totalMemory - $availableMemory, 2)
    $memoryPercent = [math]::Round(($usedMemory / $totalMemory) * 100, 2)
    
    # Disco
    $diskRead = Get-Counter "\PhysicalDisk(_Total)\Disk Read Bytes/sec" -SampleInterval 1 -MaxSamples 1
    $diskWrite = Get-Counter "\PhysicalDisk(_Total)\Disk Write Bytes/sec" -SampleInterval 1 -MaxSamples 1
    $diskReadMB = [math]::Round($diskRead.CounterSamples[0].CookedValue / 1MB, 2)
    $diskWriteMB = [math]::Round($diskWrite.CounterSamples[0].CookedValue / 1MB, 2)
    
    # Rede
    $networkIn = Get-Counter "\Network Interface(*)\Bytes Received/sec" -SampleInterval 1 -MaxSamples 1 | 
                 Where-Object {$_.CounterSamples.InstanceName -notlike "*Loopback*"} |
                 Measure-Object -Property @{Expression={$_.CounterSamples.CookedValue}} -Sum
    $networkOut = Get-Counter "\Network Interface(*)\Bytes Sent/sec" -SampleInterval 1 -MaxSamples 1 |
                  Where-Object {$_.CounterSamples.InstanceName -notlike "*Loopback*"} |
                  Measure-Object -Property @{Expression={$_.CounterSamples.CookedValue}} -Sum
    
    $networkInMB = [math]::Round($networkIn.Sum / 1MB, 2)
    $networkOutMB = [math]::Round($networkOut.Sum / 1MB, 2)
    
    # Log
    $logLine = "$timestamp,$cpuPercent,$usedMemory,$memoryPercent,$diskReadMB,$diskWriteMB,$networkInMB,$networkOutMB"
    $logLine | Out-File -FilePath $logFile -Append -Encoding UTF8
    
    # Display
    Write-Host "[$timestamp] CPU: $cpuPercent% | RAM: $memoryPercent% ($usedMemory MB) | Disk: R:$diskReadMB W:$diskWriteMB MB/s" -ForegroundColor White
    
    Start-Sleep -Seconds $Interval
}

Write-Host ""
Write-Host "Monitoramento concluido!" -ForegroundColor Green
Write-Host "Log salvo em: $logFile" -ForegroundColor Yellow