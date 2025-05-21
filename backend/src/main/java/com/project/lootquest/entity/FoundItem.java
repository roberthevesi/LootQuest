package com.project.lootquest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "found_items")
public class FoundItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "found_by_user_id", nullable = false)
    private Integer foundByUserId;

    @Column(name = "lost_item_id", nullable = false)
    private Integer lostItemId;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "created_at_date_time", nullable = false)
    private LocalDateTime createdAtDateTime;

}
