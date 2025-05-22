package com.project.lootquest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "lost_items")
public class LostItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "radius", nullable = false)
    private Double radius;

    @Column(name = "is_found", nullable = false)
    private Boolean isFound;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at_date_time", nullable = false)
    private LocalDateTime createdAtDateTime;
}
