package com.project.lootquest.controller;

import com.project.lootquest.dto.AddLostItemRequestDto;
import com.project.lootquest.entity.LostItem;
import com.project.lootquest.service.LostItemService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/items")
public class ItemController {
    private final LostItemService lostItemService;

    @PostMapping("/add-lost-item")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> addLostItem(
            @RequestBody AddLostItemRequestDto addLostItemRequestDto
    ) {
        try {
            return ResponseEntity.ok(lostItemService.addLostItem(
                    LostItem.builder()
                            .userId(addLostItemRequestDto.getUserId())
                            .description(addLostItemRequestDto.getDescription())
                            .photoUrl(addLostItemRequestDto.getPhotoUrl())
                            .latitude(addLostItemRequestDto.getLatitude())
                            .longitude(addLostItemRequestDto.getLongitude())
                            .radius(addLostItemRequestDto.getRadius())
                            .build()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding lost item: " + e.getMessage());
        }
    }
}