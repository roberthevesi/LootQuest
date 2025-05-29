package com.project.lootquest.controller;

import com.project.lootquest.dto.AddFoundItemRequestDto;
import com.project.lootquest.dto.AddLostItemRequestDto;
import com.project.lootquest.entity.LostItem;
import com.project.lootquest.service.JwtService;
import com.project.lootquest.service.LostItemService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/items")
public class ItemController {
    private final LostItemService lostItemService;

    @PostMapping(value = "/add-lost-item", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> addLostItem(
            @ModelAttribute AddLostItemRequestDto addLostItemRequestDto,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader
    ) {
        try {
            String token = authorizationHeader.substring(7); // remove "Bearer "
            return ResponseEntity.ok(lostItemService.addLostItem(token, addLostItemRequestDto));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/get-your-lost-items")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getYourLostItems(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader
    ) {
        try {
            String token = authorizationHeader.substring(7); // remove "Bearer "
            return ResponseEntity.ok(lostItemService.getYourLostItems(token));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/get-your-findings")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getYourFindings(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader
    ) {
        try {
            String token = authorizationHeader.substring(7); // remove "Bearer "
            return ResponseEntity.ok(lostItemService.getYourFindings(token));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/get-findings-by-lost-item-id")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getFindingsByLostItemId(
            @RequestParam Integer lostItemId
    ) {
        try {
            return ResponseEntity.ok(lostItemService.getFindingsByLostItemId(lostItemId));
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

    @PostMapping("/resolve-lost-item")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> resolveLostItem(
            @RequestParam Integer id
    ) {
        try {
            lostItemService.resolveLostItem(id);
            return ResponseEntity.ok("Lost item resolved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/get-nearby-lost-items")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getNearbyLostItems(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) {
        try {
            String token = authorizationHeader.substring(7); // remove "Bearer "
            return ResponseEntity.ok(lostItemService.getNearbyLostItems(token, latitude, longitude));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PostMapping(value = "/add-found-item", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> addFoundItem(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @ModelAttribute AddFoundItemRequestDto addFoundItemRequestDto
            ) {
        try {
            String token = authorizationHeader.substring(7); // remove "Bearer "
            return ResponseEntity.ok(lostItemService.addFoundItem(token, addFoundItemRequestDto));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}