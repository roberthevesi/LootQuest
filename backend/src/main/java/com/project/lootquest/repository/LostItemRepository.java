package com.project.lootquest.repository;

import com.project.lootquest.entity.LostItem;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Integer> {
    // Define custom query methods if needed
    // For example: List<Item> findByCategory(String category);
}
