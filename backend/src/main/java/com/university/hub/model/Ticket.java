package com.university.hub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = true)
    private Resource resource;

    @Column(name = "location_text") // We just added this in Step 1
    private String locationText;

    private String category;
    private String description;
    private String priority;
    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // Maps to your 'user_id' column in Supabase
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}