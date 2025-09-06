package com.vynlotaste.webhook;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookConfigRepository extends JpaRepository<WebhookConfig, Long> {
    
    List<WebhookConfig> findByEventTypeAndActive(String eventType, Boolean active);
    
    List<WebhookConfig> findByActive(Boolean active);
}