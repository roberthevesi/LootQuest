package com.project.lootquest.dto;

import com.project.lootquest.model.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddLostItemRequestDto {
    private Integer userId;
    private String description;
    private String photoUrl;
    private Double latitude;
    private Double longitude;
    private Double radius;
}
