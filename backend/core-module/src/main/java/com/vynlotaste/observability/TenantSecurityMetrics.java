package com.vynlotaste.observability;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnBean(MeterRegistry.class)  // PADRÃO BIG TECH: Bean opcional - só cria se MeterRegistry estiver disponível
@RequiredArgsConstructor
public class TenantSecurityMetrics {

    private final MeterRegistry meterRegistry;

    public void incrementMismatch(String reason, String uri, String method) {
        Counter.builder("ekklesia.tenant.mismatch")
                .description("Tentativas bloqueadas por mismatch de tenant")
                .tag("reason", safe(reason))
                .tag("uri", safe(uri))
                .tag("method", safe(method))
                .register(meterRegistry)
                .increment();
    }

    private String safe(String value) {
        if (value == null) return "unknown";
        // limitar tamanho de tag
        return value.length() > 64 ? value.substring(0, 64) : value;
    }
}


