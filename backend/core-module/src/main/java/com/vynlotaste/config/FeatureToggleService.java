package com.vynlotaste.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeatureToggleService {

    private final VynloProperties vynloProperties;

    public boolean isNewUiEnabled() {
        boolean enabled = vynloProperties.getFeatures().isNewUi();
        log.debug("Feature 'new-ui' is {}", enabled ? "enabled" : "disabled");
        return enabled;
    }

    public boolean isAnalyticsEnabled() {
        boolean enabled = vynloProperties.getFeatures().isAnalytics();
        log.debug("Feature 'analytics' is {}", enabled ? "enabled" : "disabled");
        return enabled;
    }

    public boolean isBetaFeaturesEnabled() {
        boolean enabled = vynloProperties.getFeatures().isBetaFeatures();
        log.debug("Feature 'beta-features' is {}", enabled ? "enabled" : "disabled");
        return enabled;
    }

    public boolean isFeatureEnabled(String featureName) {
        return switch (featureName.toLowerCase()) {
            case "new-ui", "newui" -> isNewUiEnabled();
            case "analytics" -> isAnalyticsEnabled();
            case "beta-features", "beta" -> isBetaFeaturesEnabled();
            default -> {
                log.warn("Unknown feature flag: {}", featureName);
                yield false;
            }
        };
    }
}