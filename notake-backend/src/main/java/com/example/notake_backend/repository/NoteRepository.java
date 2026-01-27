package com.example.notake_backend.repository;

import com.example.notake_backend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    // Spring Data JPA automatically implements basic CRUD operations
    // You can add custom queries here if needed
    
    // Example: Find notes by title containing a keyword
    List<Note> findByTitleContainingIgnoreCase(String keyword);
}
