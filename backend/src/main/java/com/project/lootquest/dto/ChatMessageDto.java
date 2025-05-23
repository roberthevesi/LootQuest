package com.project.lootquest.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
public class ChatMessageDto {
    private String text;
    private String base64Image;
}
