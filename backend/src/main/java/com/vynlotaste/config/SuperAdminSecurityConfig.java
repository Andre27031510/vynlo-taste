package com.vynlotaste.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SuperAdminSecurityConfig {

    @Bean
    public SecurityFilterChain superAdminFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/v1/super-admin/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/super-admin/**").hasRole("SUPER_ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(new SuperAdminAuthFilter(), UsernamePasswordAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable());
        
        return http.build();
    }
}