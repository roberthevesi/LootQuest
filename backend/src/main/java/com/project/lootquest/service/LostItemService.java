package com.project.lootquest.service;

import com.project.lootquest.entity.LostItem;
import com.project.lootquest.entity.User;
import com.project.lootquest.repository.LostItemRepository;
import com.project.lootquest.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@NoArgsConstructor(force = true)
public class LostItemService {
    @Autowired
    private LostItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public LostItem addLostItem(LostItem lostItem) {
        try {
            return itemRepository.save(lostItem);
        }
        catch (Exception e) {
            System.out.println("Error while saving lost item: " + e.getMessage());
            return null;
        }
    }

    public void deleteLostItem(Integer id) {
        try {
            Optional<LostItem> lostItem = itemRepository.findById(id);
            if (lostItem.isPresent()) {
                itemRepository.delete(lostItem.get());
            } else {
                System.out.println("Lost item not found");
            }
        } catch (Exception e) {
            System.out.println("Error while deleting lost item: " + e.getMessage());
        }
    }

    public ArrayList<LostItem> getNearbyLostItems(Double userLatitude, Double userLongitude) {
        Double radius = 1.0; // Default radius in km

        ArrayList<LostItem> nearbyLostItems = new ArrayList<>();
        try {
            for (LostItem lostItem : itemRepository.findAll()) {
                double distance = calculateDistance(userLatitude, userLongitude, lostItem.getLatitude(), lostItem.getLongitude());
                if (distance <= radius) {
                    nearbyLostItems.add(lostItem);
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
}
