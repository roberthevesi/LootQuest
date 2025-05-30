package com.project.lootquest.repository;

import com.project.lootquest.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Integer> {
}
