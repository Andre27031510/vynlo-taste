# Monitor Avançado de Performance - Vynlo Taste
param(
    [int]$Duration = 300,
    [int]$Interval = 2,
    [string]$LogDir = "logs",
    [switch]$Detailed
)

# Configuração
$ErrorActionPreference = "SilentlyContinue"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Criar diretório de logs
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

$systemLog = "$LogDir\system-$timestamp.csv"
$jvmLog = "$LogDir\jvm-$timestamp.csv"
$networkLog = "$LogDir\network-$timestamp.csv"
$processLog = "$LogDir\process-$timestamp.csv"

Write-Host "🔍 MONITOR AVANÇADO DE PERFORMANCE" -ForegroundColor Green
Write-Host "Duração: $Duration segundos | Intervalo: $Interval segundos" -ForegroundColor Yellow
Write-Host "Logs em: $LogDir\" -ForegroundColor Cyan
Write-Host ""

# Headers dos logs
"Timestamp,CPU_Percent,Memory_Used_MB,Memory_Percent,Disk_Read_MB,Disk_Write_MB" | Out-File $systemLog -Encoding UTF8
"Timestamp,Heap_Used_MB,Heap_Max_MB,NonHeap_Used_MB,GC_Collections,GC_Time_MS" | Out-File $jvmLog -Encoding UTF8
"Timestamp,Bytes_Received_MB,Bytes_Sent_MB,Packets_Received,Packets_Sent" | Out-File $networkLog -Encoding UTF8
"Timestamp,Java_Processes,CPU_Usage,Memory_Usage_MB" | Out-File $processLog -Encoding UTF8

$startTime = Get-Date
$endTime = $startTime.AddSeconds($Duration)
$counter = 0

Write-Host "📊 Iniciando coleta de métricas..." -ForegroundColor Cyan

while ((Get-Date) -lt $endTime) {
    $counter++
    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    try {
        # Sistema
        $cpu = (Get-Counter "\Processor(_Total)\% Processor Time" -SampleInterval 1 -MaxSamples 1).CounterSamples[0].CookedValue
        $memAvailable = (Get-Counter "\Memory\Available MBytes" -SampleInterval 1 -MaxSamples 1).CounterSamples[0].CookedValue
        $totalMem = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1MB
        $usedMem = $totalMem - $memAvailable
        $memPercent = ($usedMem / $totalMem) * 100
        
        $diskRead = (Get-Counter "\PhysicalDisk(_Total)\Disk Read Bytes/sec" -SampleInterval 1 -MaxSamples 1).CounterSamples[0].CookedValue / 1MB
        $diskWrite = (Get-Counter "\PhysicalDisk(_Total)\Disk Write Bytes/sec" -SampleInterval 1 -MaxSamples 1).CounterSamples[0].CookedValue / 1MB
        
        "$now,$([math]::Round($cpu,2)),$([math]::Round($usedMem,2)),$([math]::Round($memPercent,2)),$([math]::Round($diskRead,2)),$([math]::Round($diskWrite,2))" | Out-File $systemLog -Append -Encoding UTF8
        
        # Rede
        $netIn = (Get-Counter "\Network Interface(*)\Bytes Received/sec" | Where-Object {$_.CounterSamples.InstanceName -notlike "*Loopback*"} | Measure-Object -Property @{Expression={$_.CounterSamples.CookedValue}} -Sum).Sum / 1MB
        $netOut = (Get-Counter "\Network Interface(*)\Bytes Sent/sec" | Where-Object {$_.CounterSamples.InstanceName -notlike "*Loopback*"} | Measure-Object -Property @{Expression={$_.CounterSamples.CookedValue}} -Sum).Sum / 1MB
        $packetsIn = (Get-Counter "\Network Interface(*)\Packets Received/sec" | Where-Object {$_.CounterSamples.InstanceName -notlike "*Loopback*"} | Measure-Object -Property @{Expression={$_.CounterSamples.CookedValue}} -Sum).Sum
        $packetsOut = (Get-Counter "\Network Interface(*)\Packets Sent/sec" | Where-Object {$_.CounterSamples.InstanceName -notlike "*Loopback*"} | Measure-Object -Property @{Expression={$_.CounterSamples.CookedValue}} -Sum).Sum
        
        "$now,$([math]::Round($netIn,2)),$([math]::Round($netOut,2)),$([math]::Round($packetsIn,0)),$([math]::Round($packetsOut,0))" | Out-File $networkLog -Append -Encoding UTF8
        
        # Processos Java
        $javaProcesses = Get-Process -Name "java*" -ErrorAction SilentlyContinue
        $javaCount = $javaProcesses.Count
        $javaCpu = ($javaProcesses | Measure-Object -Property CPU -Sum).Sum
        $javaMem = ($javaProcesses | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
        
        "$now,$javaCount,$([math]::Round($javaCpu,2)),$([math]::Round($javaMem,2))" | Out-File $processLog -Append -Encoding UTF8
        
        # JVM via API
        try {
            $jvmMetrics = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/performance/metrics" -TimeoutSec 5
            $heapUsed = $jvmMetrics.memory.heapUsed
            $heapMax = $jvmMetrics.memory.heapMax
            $nonHeapUsed = $jvmMetrics.memory.nonHeapUsed
            $gcCollections = $jvmMetrics.gc.totalCollections
            $gcTime = $jvmMetrics.gc.totalTime
            
            "$now,$heapUsed,$heapMax,$nonHeapUsed,$gcCollections,$gcTime" | Out-File $jvmLog -Append -Encoding UTF8
        } catch {
            "$now,0,0,0,0,0" | Out-File $jvmLog -Append -Encoding UTF8
        }
        
        # Display
        if ($Detailed -or ($counter % 5 -eq 0)) {
            Write-Host "[$now] CPU: $([math]::Round($cpu,1))% | RAM: $([math]::Round($memPercent,1))% | Java: $javaCount proc" -ForegroundColor White
        }
        
    } catch {
        Write-Host "[$now] Erro na coleta: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds $Interval
}

Write-Host ""
Write-Host "✅ Monitoramento concluído!" -ForegroundColor Green
Write-Host "📊 Logs salvos:" -ForegroundColor Yellow
Write-Host "   Sistema: $systemLog" -ForegroundColor Gray
Write-Host "   JVM: $jvmLog" -ForegroundColor Gray
Write-Host "   Rede: $networkLog" -ForegroundColor Gray
Write-Host "   Processos: $processLog" -ForegroundColor Gray

# Gerar relatório resumido
Write-Host ""
Write-Host "📈 RELATÓRIO RESUMIDO:" -ForegroundColor Cyan
$systemData = Import-Csv $systemLog
$avgCpu = ($systemData | Measure-Object -Property CPU_Percent -Average).Average
$maxCpu = ($systemData | Measure-Object -Property CPU_Percent -Maximum).Maximum
$avgMem = ($systemData | Measure-Object -Property Memory_Percent -Average).Average
$maxMem = ($systemData | Measure-Object -Property Memory_Percent -Maximum).Maximum

Write-Host "CPU - Média: $([math]::Round($avgCpu,1))% | Máximo: $([math]::Round($maxCpu,1))%" -ForegroundColor White
Write-Host "RAM - Média: $([math]::Round($avgMem,1))% | Máximo: $([math]::Round($maxMem,1))%" -ForegroundColor White
Write-Host "Amostras coletadas: $counter" -ForegroundColor White