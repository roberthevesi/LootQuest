package com.project.lootquest.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;
import org.json.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.stream.Collectors;

import com.project.lootquest.dto.ChatMessageDto;

@Service
public class GptService {
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    @Value("${gpt.apikey}")
    private String apiKey;

    public String getChatCompletion(List<ChatMessageDto> messages) throws IOException {
        String payload = constructPayload(messages);

        HttpURLConnection connection = (HttpURLConnection) new URL(API_URL).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", "Bearer " + apiKey);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = payload.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int status = connection.getResponseCode();
        InputStream responseStream = (status == 200) ? connection.getInputStream() : connection.getErrorStream();
        String response;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(responseStream))) {
            response = reader.lines().collect(Collectors.joining());
        }

        connection.disconnect();

        return extractAssistantReply(response);
    }

    private String constructPayload(List<ChatMessageDto> messages) {
        JSONObject payload = new JSONObject();
        payload.put("model", "gpt-4o-mini");

        JSONArray messagesArray = new JSONArray();

        for (ChatMessageDto msg : messages) {
            JSONArray contentArray = new JSONArray();

            if (msg.getText() != null && !msg.getText().isEmpty()) {
                JSONObject textContent = new JSONObject();
                textContent.put("type", "text");
                textContent.put("text", msg.getText());
                contentArray.put(textContent);
            }

            if (msg.getBase64Image() != null && !msg.getBase64Image().isEmpty()) {
                JSONObject imageUrl = new JSONObject();
                imageUrl.put("url", "data:image/jpeg;base64," + msg.getBase64Image());

                JSONObject imageContent = new JSONObject();
                imageContent.put("type", "image_url");
                imageContent.put("image_url", imageUrl);

                contentArray.put(imageContent);
            }

            if (contentArray.length() > 0) {
                JSONObject messageObject = new JSONObject();
                messageObject.put("role", "user");
                messageObject.put("content", contentArray);
                messagesArray.put(messageObject);
            }
        }

        payload.put("messages", messagesArray);
        return payload.toString();
    }

    private String extractAssistantReply(String jsonResponse) {
        JSONObject root = new JSONObject(jsonResponse);

        JSONArray choicesArray = root.optJSONArray("choices");
        JSONObject firstChoice = choicesArray.optJSONObject(0);
        JSONObject messageObject = firstChoice.optJSONObject("message");
        Object contentValue = messageObject.opt("content");

        return (String) contentValue;
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}