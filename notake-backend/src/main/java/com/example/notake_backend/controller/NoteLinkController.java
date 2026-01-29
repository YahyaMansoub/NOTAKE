package com.example.notake_backend.controller;

import com.example.notake_backend.dto.NoteLinkDTO;
import com.example.notake_backend.dto.NoteLinkRequest;
import com.example.notake_backend.model.Note;
import com.example.notake_backend.model.NoteLink;
import com.example.notake_backend.model.User;
import com.example.notake_backend.repository.NoteLinkRepository;
import com.example.notake_backend.repository.NoteRepository;
import com.example.notake_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/note-links")
@CrossOrigin(origins = "*")
public class NoteLinkController {
    
    @Autowired
    private NoteLinkRepository noteLinkRepository;
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all links for the authenticated user
    @GetMapping
    public ResponseEntity<List<NoteLinkDTO>> getAllLinks(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<NoteLink> links = noteLinkRepository.findByUserId(user.getId());
        List<NoteLinkDTO> linkDTOs = links.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(linkDTOs);
    }
    
    // Create a new link between notes
    @PostMapping
    @Transactional
    public ResponseEntity<?> createLink(
            @RequestBody NoteLinkRequest request,
            Authentication authentication) {
        
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate both notes exist and belong to the user
        Note sourceNote = noteRepository.findById(request.getSourceNoteId())
                .filter(note -> note.getUser().getId().equals(user.getId()))
                .orElse(null);
        
        Note targetNote = noteRepository.findById(request.getTargetNoteId())
                .filter(note -> note.getUser().getId().equals(user.getId()))
                .orElse(null);
        
        if (sourceNote == null || targetNote == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Notes not found or unauthorized");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        // Check if link already exists
        if (noteLinkRepository.existsBySourceNoteAndTargetNote(sourceNote, targetNote)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Link already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
        
        // Create the link
        NoteLink link = new NoteLink(sourceNote, targetNote);
        link = noteLinkRepository.save(link);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(link));
    }
    
    // Delete a link
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteLink(
            @PathVariable Long id,
            Authentication authentication) {
        
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return noteLinkRepository.findById(id)
                .filter(link -> link.getSourceNote().getUser().getId().equals(user.getId()))
                .map(link -> {
                    noteLinkRepository.delete(link);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Link deleted successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    private NoteLinkDTO convertToDTO(NoteLink link) {
        return new NoteLinkDTO(
                link.getId(),
                link.getSourceNote().getId(),
                link.getTargetNote().getId(),
                link.getCreatedAt().toString()
        );
    }
}
