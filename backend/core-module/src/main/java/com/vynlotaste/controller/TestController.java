package com.vynlotaste.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from TestController!";
    }

    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("status", "ok", "message", "Backend is running");
    }

    @PostMapping("/sync-test")
    public Map<String, Object> syncTest(@RequestBody Map<String, Object> data) {
        return Map.of(
            "status", "success",
            "message", "Sync test endpoint working",
            "received_data", data
        );
    }
}
