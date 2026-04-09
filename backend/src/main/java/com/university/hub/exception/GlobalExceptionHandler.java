package com.university.hub.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        // This prints the error to your VS Code terminal
        ex.printStackTrace(); 
        // This sends the specific reason to your browser alert
        return ResponseEntity.status(500).body("Database Error: " + ex.getLocalizedMessage());
    }
}