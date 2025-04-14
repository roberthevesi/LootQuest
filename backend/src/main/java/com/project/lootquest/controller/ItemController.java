package com.project.lootquest.controller;

import com.project.lootquest.dto.AddLostItemRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/item")
@RequiredArgsConstructor
public class ItemController {
    @PostMapping("/add-lost-item")
    public ResponseEntity<?> addLostItem(
            @RequestBody AddLostItemRequestDto addLostItemRequestDto
    ) {
        try {
            return ResponseEntity.ok("Lost item added successfully");
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding lost item: " + e.getMessage());
        }
    }
}
