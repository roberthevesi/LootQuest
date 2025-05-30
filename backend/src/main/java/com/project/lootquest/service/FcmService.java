package com.project.lootquest.service;

import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FcmService {
    public String sendToToken(String token,
                              String title,
                              String body,
                              Map<String, String> data)
            throws FirebaseMessagingException {

        Message msg = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .putAllData(data)
                .build();

        return FirebaseMessaging.getInstance().send(msg);
    }
}
