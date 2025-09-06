package com.vynlotaste.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.vynlotaste")
@EntityScan(basePackages = "com.vynlotaste.entity")
@EnableJpaRepositories(basePackages = "com.vynlotaste.repository")
public class CoreModuleApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoreModuleApplication.class, args);
    }
}