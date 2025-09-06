package com.vynlotaste.monitoring;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SimpleMonitoringService {

    private final MeterRegistry meterRegistry;

    public void recordOrder() {
        Counter.builder("vynlo.orders.total")
            .description("Total orders")
            .register(meterRegistry)
            .increment();
        log.info("Order recorded");
    }

    public void recordDelivery(long minutes) {
        Counter.builder("vynlo.deliveries.total")
            .description("Total deliveries")
            .register(meterRegistry)
            .increment();
        log.info("Delivery recorded: {} minutes", minutes);
    }

    public void recordError(String type) {
        Counter.builder("vynlo.errors.total")
            .tag("type", type)
            .description("Total errors")
            .register(meterRegistry)
            .increment();
        log.error("Error recorded: {}", type);
    }
}