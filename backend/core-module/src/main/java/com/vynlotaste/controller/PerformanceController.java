package com.vynlotaste.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.RuntimeMXBean;
import java.lang.management.GarbageCollectorMXBean;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // JVM Memory
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        Map<String, Object> memory = new HashMap<>();
        memory.put("heapUsed", memoryBean.getHeapMemoryUsage().getUsed() / 1024 / 1024);
        memory.put("heapMax", memoryBean.getHeapMemoryUsage().getMax() / 1024 / 1024);
        memory.put("nonHeapUsed", memoryBean.getNonHeapMemoryUsage().getUsed() / 1024 / 1024);
        
        // Runtime
        RuntimeMXBean runtimeBean = ManagementFactory.getRuntimeMXBean();
        Map<String, Object> runtime = new HashMap<>();
        runtime.put("uptime", runtimeBean.getUptime());
        runtime.put("startTime", runtimeBean.getStartTime());
        
        // GC
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        Map<String, Object> gc = new HashMap<>();
        long totalCollections = 0;
        long totalTime = 0;
        
        for (GarbageCollectorMXBean gcBean : gcBeans) {
            totalCollections += gcBean.getCollectionCount();
            totalTime += gcBean.getCollectionTime();
        }
        
        gc.put("totalCollections", totalCollections);
        gc.put("totalTime", totalTime);
        
        metrics.put("memory", memory);
        metrics.put("runtime", runtime);
        metrics.put("gc", gc);
        metrics.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/load-test")
    public ResponseEntity<Map<String, Object>> loadTest(@RequestParam(defaultValue = "100") int iterations) {
        long startTime = System.currentTimeMillis();
        
        // Simular carga de trabalho mais realística
        for (int i = 0; i < iterations; i++) {
            // Simular operações de CPU
            Math.pow(Math.random(), 2);
            // Simular operações de string
            String.valueOf(System.nanoTime()).hashCode();
            // Simular pequena pausa
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        long endTime = System.currentTimeMillis();
        
        Map<String, Object> result = new HashMap<>();
        result.put("iterations", iterations);
        result.put("executionTime", endTime - startTime);
        result.put("avgTimePerIteration", (double)(endTime - startTime) / iterations);
        result.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stress-test")
    public ResponseEntity<Map<String, Object>> stressTest(@RequestParam(defaultValue = "1000") int load) {
        long startTime = System.currentTimeMillis();
        
        // Simular carga de stress
        for (int i = 0; i < load; i++) {
            // Operações intensivas
            for (int j = 0; j < 100; j++) {
                Math.sin(Math.random() * Math.PI);
            }
        }
        
        long endTime = System.currentTimeMillis();
        
        Map<String, Object> result = new HashMap<>();
        result.put("load", load);
        result.put("executionTime", endTime - startTime);
        result.put("operationsPerSecond", (double)load * 100 / ((endTime - startTime) / 1000.0));
        result.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(result);
    }
}