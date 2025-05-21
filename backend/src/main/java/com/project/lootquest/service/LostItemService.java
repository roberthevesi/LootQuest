package com.project.lootquest.service;

import com.project.lootquest.dto.AddFoundItemRequestDto;
import com.project.lootquest.dto.AddLostItemRequestDto;
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

    @Transactional
    public LostItem addLostItem(AddLostItemRequestDto request) {
        LostItem item = LostItem.builder()
                .userId(request.getUserId())
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

    public String extractKeyFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    public void removeImageFromS3(String url) {
        String key = extractKeyFromUrl(url);
        s3Service.deleteFile(key);
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

    public ArrayList<LostItem> getNearbyLostItems(Double userLatitude, Double userLongitude) {
        Double radius = 1.0; // Default radius in km

        ArrayList<LostItem> nearbyLostItems = new ArrayList<>();
        try {
            for (LostItem lostItem : lostItemRepository.findAll()) {
                if (!lostItem.getIsFound()) {
                    double distance = calculateDistance(userLatitude, userLongitude, lostItem.getLatitude(), lostItem.getLongitude());
                    if (distance <= radius) {
                        nearbyLostItems.add(lostItem);
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

            // @Radu.Micea
            // call GPT item matching API
            boolean itemMatched = true; // Placeholder for actual matching logic

            if (!itemMatched) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item does not match.");
            }

            // Upload photo to S3
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

                return foundItemRepository.save(newFoundItem);
            } catch (IOException e) {
                throw new RuntimeException("Photo upload failed", e);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving found item: " + e.getMessage());
        }
    }
}
