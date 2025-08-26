package com.vynlotaste;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.SystemMetricsAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(
    scanBasePackages = "com.vynlotaste",
    exclude = {SystemMetricsAutoConfiguration.class}
)
@EnableJpaAuditing
public class VynloTasteApplication {
    public static void main(String[] args) {
        SpringApplication.run(VynloTasteApplication.class, args);
    }
}