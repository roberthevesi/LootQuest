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
    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private FoundItemRepository foundItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private GptService gptService;

    @Transactional
    public LostItem addLostItem(AddLostItemRequestDto request) {
        LostItem item = LostItem.builder()
                .userId(request.getUserId())
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
            String photoUrl = s3Service.uploadFile(request.getPhoto());
            item.setPhotoUrl(photoUrl);
        } catch (IOException e) {
            throw new RuntimeException("Photo upload failed", e);
        }

        return lostItemRepository.save(item);
    }

    public ArrayList<LostItem> getYourLostItems(Integer userId) {
        ArrayList<LostItem> lostItems = new ArrayList<>();
        try {
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
            Optional<LostItem> lostItem = lostItemRepository.findById(id);
            if (lostItem.isPresent()) {
                String photoUrl = lostItem.get().getPhotoUrl();
                if (photoUrl != null) {
                    String key = extractKeyFromUrl(photoUrl);
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

    public ArrayList<LostItem> getNearbyLostItems(Integer userId, Double userLatitude, Double userLongitude) {
        double radius = 0.5; // Default radius in km

        ArrayList<LostItem> nearbyLostItems = new ArrayList<>();
        try {
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

    public FoundItem addFoundItem(AddFoundItemRequestDto addFoundItemRequestDto) {
        if (!userRepository.existsById(addFoundItemRequestDto.getFoundByUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is invalid.");
        }

        Optional<LostItem> lostItem = lostItemRepository.findById(addFoundItemRequestDto.getLostItemId());
        if (lostItem.isEmpty() || Boolean.TRUE.equals(lostItem.get().getIsFound())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lost item not found or already marked as found.");
        }

        try {
            String foundItemDescription = addFoundItemRequestDto.getDescription(); // use this
            byte[] foundItemPhoto = addFoundItemRequestDto.getPhoto().getBytes();
            String base64Found = Base64.getEncoder().encodeToString(foundItemPhoto); // use this

            String lostItemDescription = lostItem.get().getDescription(); // use this
            byte[] lostItemPhoto = s3Service.downloadFileAsBytes(lostItem.get().getPhotoUrl());
            String base64Lost = Base64.getEncoder().encodeToString(lostItemPhoto); // use this

            boolean itemMatched = checkItemMatches(lostItemDescription, base64Lost, foundItemDescription, base64Found);

            if (!itemMatched) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item does not match.");
            }

            try {
                String photoUrl = s3Service.uploadFile(addFoundItemRequestDto.getPhoto());

                FoundItem newFoundItem = FoundItem.builder()
                        .foundByUserId(addFoundItemRequestDto.getFoundByUserId())
                        .photoUrl(photoUrl)
                        .lostItemId(addFoundItemRequestDto.getLostItemId())
                        .description(addFoundItemRequestDto.getDescription())
                        .latitude(addFoundItemRequestDto.getLatitude())
                        .longitude(addFoundItemRequestDto.getLongitude())
                        .createdAtDateTime(LocalDateTime.now())
                        .build();

                notifyUserOfFoundItem(lostItem.get().getUserId(), lostItem.get().getTitle(), lostItem.get().getPhotoUrl());

                return foundItemRepository.save(newFoundItem);
            } catch (IOException e) {
                throw new RuntimeException("Photo upload failed", e);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving found item: " + e.getMessage());
        }
    }

    private void notifyUserOfFoundItem(Integer userId, String itemTitle, String photoUrl) {
        // @Radu.Micea
        // Implement the logic to notify the user about the found item
        System.out.println("User " + userId + " has been notified about the found item: " + itemTitle + " with photo URL: " + photoUrl);
    }

    private boolean checkItemMatches(String lostItemDescription, String lostItemPhoto, String foundItemDescription, String foundItemPhoto) throws IOException {
        ChatMessageDto systemMessage = new ChatMessageDto(SystemPrompt, null);
        ChatMessageDto lostItemMessage = new ChatMessageDto("This is the lost item description and optionally photo: " + lostItemDescription, lostItemPhoto);
        ChatMessageDto foundItemMessage = new ChatMessageDto("This is the found item photo and optionally description: " + foundItemDescription, foundItemPhoto);

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
