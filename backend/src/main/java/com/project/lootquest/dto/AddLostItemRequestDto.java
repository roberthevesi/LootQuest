package com.project.lootquest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(name = "AddLostItemRequestDto")
public class AddLostItemRequestDto {
    private String title;
    private String description;
    private MultipartFile photo;
    private Double latitude;
    private Double longitude;
    private Double radius;
}
