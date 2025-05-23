package com.project.lootquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddFoundItemRequestDto {
    private Integer foundByUserId;
    private Integer lostItemId;
    private String description;
    private MultipartFile photo;
    private Double latitude;
    private Double longitude;
}
