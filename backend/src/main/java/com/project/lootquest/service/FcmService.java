package com.project.lootquest.service;

import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FcmService {
    public String sendToToken(String token,
                              String title,
                              String body,
                              String imageUrl)
            throws FirebaseMessagingException {

        Notification.Builder notificationBuilder = Notification.builder()
                .setTitle(title)
                .setBody(body);

        if (imageUrl != null && !imageUrl.isEmpty()) {
            notificationBuilder.setImage(imageUrl);
        }

        Message msg = Message.builder()
                .setToken(token)
                .setNotification(notificationBuilder.build())
                .build();

        return FirebaseMessaging.getInstance().send(msg);
    }
}
