package com.example.notake_backend.repository;

import com.example.notake_backend.model.Note;
import com.example.notake_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    // Spring Data JPA automatically implements basic CRUD operations
    // You can add custom queries here if needed
    
    // Find notes by user
    List<Note> findByUser(User user);
    List<Note> findByUserOrderByUpdatedAtDesc(User user);
    
    // Example: Find notes by title containing a keyword
    List<Note> findByTitleContainingIgnoreCase(String keyword);
    List<Note> findByUserAndTitleContainingIgnoreCase(User user, String keyword);
    
    // Count notes by user
    long countByUser(User user);
}
