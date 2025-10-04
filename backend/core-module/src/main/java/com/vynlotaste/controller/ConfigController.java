package com.vynlotaste.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*")
public class ConfigController {

    @Value("${firebase.project-id}")
    private String firebaseProjectId;

    @GetMapping("/firebase")
    public Map<String, String> getFirebaseConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("apiKey", "AIzaSyApXH8Qx1n6B82sZyAtwJ6NNxJfQlEz36Q");
        config.put("authDomain", firebaseProjectId + ".firebaseapp.com");
        config.put("projectId", firebaseProjectId);
        config.put("storageBucket", firebaseProjectId + ".firebasestorage.app");
        config.put("messagingSenderId", "348634037274");
        config.put("appId", "1:348634037274:web:169fa8a9c3d85850cda5a3");
        return config;
    }
}