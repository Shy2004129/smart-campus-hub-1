package com.university.hub.controller;

import com.university.hub.model.Resource;
import com.university.hub.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceRepository repo;

    @GetMapping
    public List<Resource> getResources() {
        return repo.findAll();
    }
}