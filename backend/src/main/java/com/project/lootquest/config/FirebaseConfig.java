package com.project.lootquest.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("classpath:firebase/serviceAccountKey.json")
    private Resource serviceAccount;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        FirebaseOptions opts = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                .build();

        return FirebaseApp.getApps().isEmpty()
                ? FirebaseApp.initializeApp(opts)
                : FirebaseApp.getInstance();
    }
}
