package com.example.notake_backend.controller;

import com.example.notake_backend.dto.ProfileDTO;
import com.example.notake_backend.dto.ProfileUpdateRequest;
import com.example.notake_backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;
    
    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(Authentication authentication) {
        String username = authentication.getName();
        ProfileDTO profile = profileService.getOrCreateProfile(username);
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        ProfileDTO profile = profileService.updateProfile(username, request);
        return ResponseEntity.ok(profile);
    }
    
    @PostMapping("/upload-image")
    public ResponseEntity<ProfileDTO> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Validate file type (images only)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }
        
        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().build();
        }
        
        String username = authentication.getName();
        ProfileDTO profile = profileService.uploadProfileImage(username, file);
        return ResponseEntity.ok(profile);
    }
}
