package com.vynlotaste.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Data
@Component
@Validated
@ConfigurationProperties(prefix = "vynlo")
public class VynloProperties {

    private Features features = new Features();
    private RateLimit rateLimit = new RateLimit();
    private Cors cors = new Cors();
    private Ssl ssl = new Ssl();
    private Backup backup = new Backup();

    @Data
    public static class Features {
        private boolean newUi = false;
        private boolean analytics = true;
        private boolean betaFeatures = false;
    }

    @Data
    public static class RateLimit {
        @Min(1)
        @Max(10000)
        private int requestsPerMinute = 300;
        
        @Min(1)
        @Max(1000)
        private int burstCapacity = 30;
    }

    @Data
    public static class Cors {
        @NotEmpty
        private List<String> allowedOrigins;
        
        @NotEmpty
        private List<String> allowedMethods;
        
        @NotEmpty
        private List<String> allowedHeaders;
        
        private boolean allowCredentials = true;
        
        @Min(0)
        @Max(86400)
        private long maxAge = 3600;
        
        @Min(0)
        @Max(86400)
        private long preflightMaxAge = 3600;
        
        private boolean loggingEnabled = false;
        
        @Min(1)
        @Max(10000)
        private int rateLimitPerOrigin = 300;
        
        private boolean strictOriginValidation = false;
    }

    @Data
    public static class Ssl {
        private boolean enabled = false;
        
        private String keyStore;
        private String keyStorePassword;
        private String keyStoreType = "PKCS12";
        private String trustStore;
        private String trustStorePassword;
    }

    @Data
    public static class Backup {
        private boolean enabled = false;
        
        @NotBlank
        private String schedule = "0 2 * * *";
        
        @Min(1)
        @Max(365)
        private int retentionDays = 30;
        
        private String s3Bucket;
    }
}