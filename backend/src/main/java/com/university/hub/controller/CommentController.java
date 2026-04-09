package com.university.hub.controller;

import com.university.hub.model.Comment;
import com.university.hub.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CommentController {
    private final CommentRepository commentRepo;

    @GetMapping("/ticket/{ticketId}")
    public List<Comment> getByTicket(@PathVariable Long ticketId) {
        return commentRepo.findByTicketId(ticketId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // Mark for proper status codes (201)
    public Comment add(@RequestBody Comment comment) {
        return commentRepo.save(comment);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Mark for proper status codes (204)
    public void delete(@PathVariable Long id) {
        commentRepo.deleteById(id);
    }
}