package com.vynlotaste.config;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import java.util.Date;

@Configuration
@Profile("test")
public class TestFirebaseConfig {

    @Bean
    @Primary
    public FirebaseApp testFirebaseApp() {
        FirebaseApp mockApp = Mockito.mock(FirebaseApp.class);

        AccessToken token = new AccessToken("test-token", new Date(System.currentTimeMillis() + 3_600_000));
        GoogleCredentials credentials = GoogleCredentials.create(token);
        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        HttpTransport transport = new NetHttpTransport();

        FirebaseOptions options = FirebaseOptions.builder()
            .setProjectId("test-project")
            .setCredentials(credentials)
            .setJsonFactory(jsonFactory)
            .setHttpTransport(transport)
            .build();

        Mockito.when(mockApp.getName()).thenReturn("mockFirebaseApp");
        Mockito.when(mockApp.getOptions()).thenReturn(options);

        return mockApp;
    }

    @Bean
    @Primary
    public FirebaseAuth testFirebaseAuth(FirebaseApp firebaseApp) {
        return Mockito.mock(FirebaseAuth.class);
    }
}
