package com.university.hub.controller;

import com.university.hub.model.Ticket;
import com.university.hub.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TicketController {
    private final TicketRepository ticketRepo;

    @GetMapping
    public List<Ticket> getAll() {
        return ticketRepo.findAll();
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        // THIS IS THE TRACE LOG
        System.out.println("--- SIGNAL RECEIVED: TICKET CREATION START ---");
        System.out.println("Description: " + ticket.getDescription());
        
        ticket.setStatus("OPEN");
        Ticket saved = ticketRepo.save(ticket);
        
        System.out.println("--- SIGNAL SUCCESS: TICKET SAVED TO DB ---");
        return saved;
    }
}