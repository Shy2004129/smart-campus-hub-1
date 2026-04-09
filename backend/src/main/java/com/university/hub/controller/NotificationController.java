package com.university.hub.controller;

import com.university.hub.model.Notification;
import com.university.hub.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notifRepo;

    // Get all notifications for User ID 1 (your test user)
    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {
        return notifRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Mark a notification as read so the red dot disappears
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        Notification n = notifRepo.findById(id).orElseThrow();
        n.setRead(true);
        notifRepo.save(n);
    }
}