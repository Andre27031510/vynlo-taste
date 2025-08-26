package com.vynlotaste.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("prod")
public class SSLConfig {

    @Value("${server.ssl.key-store:}")
    private String keyStore;

    @Value("${server.ssl.key-store-password:}")
    private String keyStorePassword;

    @Value("${server.ssl.key-alias:}")
    private String keyAlias;

    @Value("${server.ssl.enabled:false}")
    private boolean sslEnabled;

    @Bean
    public ServletWebServerFactory servletContainer() {
        if (!sslEnabled) {
            return new TomcatServletWebServerFactory();
        }

        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addConnectorCustomizers(connector -> {
            connector.setScheme("https");
            connector.setSecure(true);
            connector.setProperty("SSLEnabled", "true");
            connector.setProperty("keystoreFile", keyStore);
            connector.setProperty("keystorePass", keyStorePassword);
            connector.setProperty("keystoreType", "PKCS12");
            connector.setProperty("keyAlias", keyAlias);
            connector.setProperty("clientAuth", "false");
            connector.setProperty("sslProtocol", "TLS");
            connector.setProperty("sslEnabledProtocols", "TLSv1.2,TLSv1.3");
            connector.setProperty("sslCipherSuites", "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384");
        });

        return tomcat;
    }
}
