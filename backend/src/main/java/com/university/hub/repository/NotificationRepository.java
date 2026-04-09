package com.university.hub.repository;

import com.university.hub.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Find notifications for a specific user and show the newest ones first
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}