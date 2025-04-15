package com.project.lootquest.service;

import com.project.lootquest.entity.LostItem;
import com.project.lootquest.entity.User;
import com.project.lootquest.repository.LostItemRepository;
import com.project.lootquest.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
