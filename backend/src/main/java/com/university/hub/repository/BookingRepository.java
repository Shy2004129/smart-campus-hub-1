package com.university.hub.repository;

import com.university.hub.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Add this
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.resource.id = :resourceId " +
           "AND b.status = 'APPROVED' " +
           "AND (:start < b.endTime AND :end > b.startTime)")
    boolean existsOverlapping(
        @Param("resourceId") Long resourceId, 
        @Param("start") LocalDateTime start, 
        @Param("end") LocalDateTime end
    );

    List<Booking> findByUserId(Long userId);
}