package com.example.notake_backend.controller;

import com.example.notake_backend.model.Note;
import com.example.notake_backend.model.User;
import com.example.notake_backend.repository.NoteRepository;
import com.example.notake_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*") // Allow frontend to access the API
public class NoteController {
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // GET all notes for authenticated user
    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Note> notes = noteRepository.findByUserOrderByUpdatedAtDesc(user);
        return ResponseEntity.ok(notes);
    }
    
    // GET a single note by ID (verify ownership)
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return noteRepository.findById(id)
                .filter(note -> note.getUser().getId().equals(user.getId()))
                .map(note -> ResponseEntity.ok(note))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // POST - Create a new note
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note, Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            note.setUser(user);
            Note savedNote = noteRepository.save(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // PUT - Update an existing note (verify ownership)
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return noteRepository.findById(id)
                .filter(note -> note.getUser().getId().equals(user.getId()))
                .map(note -> {
                    note.setTitle(noteDetails.getTitle());
                    note.setContent(noteDetails.getContent());
                    Note updatedNote = noteRepository.save(note);
                    return ResponseEntity.ok(updatedNote);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // DELETE a note (verify ownership)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNote(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return noteRepository.findById(id)
                .filter(note -> note.getUser().getId().equals(user.getId()))
                .map(note -> {
                    noteRepository.delete(note);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Note deleted successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // GET - Search notes by title (user-specific)
    @GetMapping("/search")
    public ResponseEntity<List<Note>> searchNotes(@RequestParam String keyword, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Note> notes = noteRepository.findByUserAndTitleContainingIgnoreCase(user, keyword);
        return ResponseEntity.ok(notes);
    }
    
    // GET - Count total notes (user-specific)
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countNotes(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        long count = noteRepository.countByUser(user);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
