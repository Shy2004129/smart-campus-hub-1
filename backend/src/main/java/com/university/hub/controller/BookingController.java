package com.university.hub.controller;

// Check these 3 lines carefully:
import com.university.hub.model.Resource;
import com.university.hub.model.Booking; // <--- ADD THIS LINE
import com.university.hub.repository.BookingRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepo;

    @GetMapping
    public List<Booking> getAll() {
        return bookingRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // This will print the data to your VS Code terminal so we can see it
        System.out.println("Received Booking Request: " + booking);

        try {
            boolean conflict = bookingRepo.existsOverlapping(
                booking.getResource().getId(), 
                booking.getStartTime(), 
                booking.getEndTime()
            );

            if (conflict) {
                return ResponseEntity.status(409).body("Error: This time slot is already booked!");
            }

            booking.setStatus("PENDING");
            return ResponseEntity.ok(bookingRepo.save(booking));
        } catch (Exception e) {
            e.printStackTrace(); // This prints the BIG RED ERROR to the terminal
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }
}