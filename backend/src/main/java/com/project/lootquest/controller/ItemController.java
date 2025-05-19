package com.project.lootquest.controller;

import com.project.lootquest.dto.AddLostItemRequestDto;
import com.project.lootquest.entity.LostItem;
import com.project.lootquest.service.LostItemService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-lost-item")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> deleteLostItem(
            @RequestParam Integer id
    ) {
        try {
            lostItemService.deleteLostItem(id);
            return ResponseEntity.ok("Lost item deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/get-nearby-lost-items")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getNearbyLostItems(
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) {
        try {
            return ResponseEntity.ok(lostItemService.getNearbyLostItems(latitude, longitude));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

}