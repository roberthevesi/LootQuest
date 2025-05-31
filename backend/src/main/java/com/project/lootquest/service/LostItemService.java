package com.project.lootquest.service;

import com.project.lootquest.dto.AddFoundItemRequestDto;
import com.project.lootquest.dto.AddLostItemRequestDto;
import com.project.lootquest.dto.ChatMessageDto;
import com.project.lootquest.entity.FoundItem;
import com.project.lootquest.entity.LostItem;
import com.project.lootquest.repository.FoundItemRepository;
import com.project.lootquest.repository.LostItemRepository;
import com.project.lootquest.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;
import org.json.*;

@Service
@NoArgsConstructor(force = true)
public class LostItemService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final GptService gptService;
    private final JwtService jwtService;
    private final FcmService fcmService;

    @Autowired
    public LostItemService(
            LostItemRepository lostItemRepository,
            FoundItemRepository foundItemRepository,
            UserRepository userRepository,
            S3Service s3Service,
            GptService gptService,
            JwtService jwtService,
            FcmService fcmService
    ) {
        this.lostItemRepository = lostItemRepository;
        this.foundItemRepository = foundItemRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
        this.gptService = gptService;
        this.jwtService = jwtService;
        this.fcmService = fcmService;
    }

    Integer getUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is missing or invalid.");
        }

        if (jwtService == null) {
            throw new IllegalStateException("JwtService is not initialized properly");
        }

        return jwtService.extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

    @Transactional
    public LostItem addLostItem(String token, AddLostItemRequestDto request) throws NullPointerException {
        Integer userId = getUserIdFromToken(token);

        LostItem item = LostItem.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .radius(request.getRadius())
                .isFound(false)
                .isActive(true)
                .createdAtDateTime(LocalDateTime.now())
                .build();

        try {
            assert s3Service != null;
            String photoUrl = s3Service.uploadFile(request.getPhoto());
            item.setPhotoUrl(photoUrl);
        } catch (IOException e) {
            throw new RuntimeException("Photo upload failed", e);
        }

        assert lostItemRepository != null;
        return lostItemRepository.save(item);
    }

    public ArrayList<LostItem> getYourLostItems(String token) {
        Integer userId = getUserIdFromToken(token);

        ArrayList<LostItem> lostItems = new ArrayList<>();
        try {
            assert lostItemRepository != null;
            for (LostItem lostItem : lostItemRepository.findAll()) {
                if (lostItem.getUserId().equals(userId)) {
                    lostItems.add(lostItem);
                }
            }
        } catch (Exception e) {
            System.out.println("Error while fetching your lost items: " + e.getMessage());
        }

        return lostItems;
    }

    public ArrayList<FoundItem> getFindingsByLostItemId(Integer lostItemId) {
        ArrayList<FoundItem> foundItems = new ArrayList<>();
        try {
            assert foundItemRepository != null;
            for (FoundItem foundItem : foundItemRepository.findAll()) {
                if (foundItem.getLostItemId().equals(lostItemId)) {
                    foundItems.add(foundItem);
                }
            }
        } catch (Exception e) {
            System.out.println("Error while fetching your found items: " + e.getMessage());
        }

        return foundItems;
    }

    public String extractKeyFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    public void deleteLostItem(Integer id) {
        try {
            assert lostItemRepository != null;
            Optional<LostItem> lostItem = lostItemRepository.findById(id);
            if (lostItem.isPresent()) {
                String photoUrl = lostItem.get().getPhotoUrl();
                if (photoUrl != null) {
                    String key = extractKeyFromUrl(photoUrl);
                    assert s3Service != null;
                    s3Service.deleteFile(key);
                }
                lostItemRepository.delete(lostItem.get());
            } else {
                System.out.println("Lost item not found");
            }
        } catch (Exception e) {
            System.out.println("Error while deleting lost item: " + e.getMessage());
        }
    }

    public void resolveLostItem(Integer id) {
        try {
            assert lostItemRepository != null;
            Optional<LostItem> lostItem = lostItemRepository.findById(id);
            if (lostItem.isPresent()) {
                LostItem item = lostItem.get();
                item.setIsFound(true);
                item.setIsActive(false);
                lostItemRepository.save(item);
            } else {
                System.out.println("Lost item not found");
            }
        } catch (Exception e) {
            System.out.println("Error while resolving lost item: " + e.getMessage());
        }
    }

    public ArrayList<LostItem> getNearbyLostItems(String token, Double userLatitude, Double userLongitude) {
        Integer userId = getUserIdFromToken(token);
        double radius = 0.5; // Default radius in km

        ArrayList<LostItem> nearbyLostItems = new ArrayList<>();
        try {
            assert lostItemRepository != null;
            for (LostItem lostItem : lostItemRepository.findAll()) {
                if (!lostItem.getUserId().equals(userId)){
                    if (!lostItem.getIsFound()) {
                        double distance = calculateDistance(userLatitude, userLongitude, lostItem.getLatitude(), lostItem.getLongitude());
                        if (distance <= radius) {
                            nearbyLostItems.add(lostItem);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error while fetching nearby lost items: " + e.getMessage());
        }

        return nearbyLostItems;
    }

    private double calculateDistance(Double userLatitude, Double userLongitude, Double latitude, Double longitude) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(latitude - userLatitude);
        double lonDistance = Math.toRadians(longitude - userLongitude);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(userLatitude)) * Math.cos(Math.toRadians(latitude))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    public FoundItem addFoundItem(String token, AddFoundItemRequestDto addFoundItemRequestDto) {
        Integer userId = getUserIdFromToken(token);
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is invalid.");
        }

        assert lostItemRepository != null;
        Optional<LostItem> lostItem = lostItemRepository.findById(addFoundItemRequestDto.getLostItemId());
        if (lostItem.isEmpty() || Boolean.TRUE.equals(lostItem.get().getIsFound())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lost item not found or already marked as found.");
        }

        try {
            String foundItemDescription = addFoundItemRequestDto.getDescription(); // use this
            byte[] foundItemPhoto = addFoundItemRequestDto.getPhoto().getBytes();
            String base64Found = Base64.getEncoder().encodeToString(foundItemPhoto); // use this

            String lostItemDescription = lostItem.get().getDescription(); // use this
            assert s3Service != null;
            byte[] lostItemPhoto = s3Service.downloadFileAsBytes(lostItem.get().getPhotoUrl());
            String base64Lost = Base64.getEncoder().encodeToString(lostItemPhoto); // use this

            boolean itemMatched = checkItemMatches(lostItemDescription, base64Lost, foundItemDescription, base64Found);

            if (!itemMatched) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item does not match.");
            }

            try {
                String photoUrl = s3Service.uploadFile(addFoundItemRequestDto.getPhoto());

                FoundItem newFoundItem = FoundItem.builder()
                        .foundByUserId(userId)
                        .photoUrl(photoUrl)
                        .lostItemId(addFoundItemRequestDto.getLostItemId())
                        .description(addFoundItemRequestDto.getDescription())
                        .latitude(addFoundItemRequestDto.getLatitude())
                        .longitude(addFoundItemRequestDto.getLongitude())
                        .createdAtDateTime(LocalDateTime.now())
                        .build();

                notifyUserOfFoundItem(lostItem.get().getUserId(), lostItem.get().getTitle(), lostItem.get().getPhotoUrl());

                assert foundItemRepository != null;
                return foundItemRepository.save(newFoundItem);
            } catch (IOException e) {
                throw new RuntimeException("Photo upload failed", e);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving found item: " + e.getMessage());
        }
    }

    private void notifyUserOfFoundItem(Integer userId, String itemTitle, String photoUrl) {
        User user = userRepository.findById(userId);
        String fcmToken = user.getFcmToken();

        if (fcmToken == null) {
            return;
        }

        fcmService.sendToToken(fcmToken, "Item found!", itemTitle + " has been found!", photoUrl);

        System.out.println("User " + userId + " has been notified about the found item: " + itemTitle + " with photo URL: " + photoUrl);
    }

    private boolean checkItemMatches(String lostItemDescription, String lostItemPhoto, String foundItemDescription, String foundItemPhoto) throws IOException {
        ChatMessageDto systemMessage = new ChatMessageDto(SystemPrompt, null);
        ChatMessageDto lostItemMessage = new ChatMessageDto("This is the lost item description and optionally photo: " + lostItemDescription, lostItemPhoto);
        ChatMessageDto foundItemMessage = new ChatMessageDto("This is the found item photo and optionally description: " + foundItemDescription, foundItemPhoto);

        assert gptService != null;
        String response = gptService.getChatCompletion(new ArrayList<ChatMessageDto>() {{
            add(systemMessage);
            add(lostItemMessage);
            add(foundItemMessage);
        }});

        response = response.replace("```json", "").replace("```", "").trim();

        JSONObject root = new JSONObject(response);
        boolean matchValue = root.getBoolean("match");

        return matchValue;
    }

    private static final String SystemPrompt = """
You are an assistant that determines whether a found item matches a lost item report.  
You will be given:

- A **text description** of a lost item  
- A **photo of the found item**  
- Optionally, a **photo of the lost item**
- Optionally, a **text description** of the found item

Your task is to compare these and decide if the **found item is the same as the lost item**.

Always respond with a **valid JSON object** using the following exact schema:

```json
{
  "match": true | false,
  "reason": "string",  
  "differences": ["string", ...],  
  "suggestions": ["string", ...]   
}
```

### Rules:

- Only set `"match": true` if you are confident the found item is the same as the lost item.
- If `"match"` is `false`, explain why in `reason` and list visible or logical `differences`.
- Always include all fields, even if arrays are empty.
- Output must be strictly valid JSON — no extra text, logging, or notes.
""".trim();
}
