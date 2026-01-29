package com.example.notake_backend.service;

import com.example.notake_backend.dto.ProfileDTO;
import com.example.notake_backend.dto.ProfileUpdateRequest;
import com.example.notake_backend.model.Profile;
import com.example.notake_backend.model.User;
import com.example.notake_backend.repository.FileMetadataRepository;
import com.example.notake_backend.repository.NoteRepository;
import com.example.notake_backend.repository.ProfileRepository;
import com.example.notake_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ProfileService {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Transactional
    public ProfileDTO getOrCreateProfile(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Profile profile = profileRepository.findByUser(user)
            .orElseGet(() -> {
                Profile newProfile = new Profile(user);
                return profileRepository.save(newProfile);
            });
        
        return convertToDTO(profile, user);
    }
    
    @Transactional
    public ProfileDTO updateProfile(String username, ProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Profile profile = profileRepository.findByUser(user)
            .orElseGet(() -> new Profile(user));
        
        // Update fields
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }
        if (request.getPhone() != null) {
            profile.setPhone(request.getPhone());
        }
        if (request.getWebsite() != null) {
            profile.setWebsite(request.getWebsite());
        }
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            try {
                LocalDateTime dob = LocalDateTime.parse(request.getDateOfBirth(), 
                    DateTimeFormatter.ISO_DATE_TIME);
                profile.setDateOfBirth(dob);
            } catch (Exception e) {
                // Invalid date format, skip
            }
        }
        
        profile = profileRepository.save(profile);
        return convertToDTO(profile, user);
    }
    
    @Transactional
    public ProfileDTO uploadProfileImage(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Profile profile = profileRepository.findByUser(user)
            .orElseGet(() -> new Profile(user));
        
        // Delete old profile image if exists
        if (profile.getProfileImageUrl() != null) {
            try {
                fileStorageService.deleteFile(profile.getProfileImageUrl());
            } catch (Exception e) {
                // Ignore deletion errors
            }
        }
        
        // Store new profile image
        String fileName = fileStorageService.storeProfileImage(file, user.getId());
        String fileUrl = "/api/files/profile/" + fileName;
        profile.setProfileImageUrl(fileUrl);
        
        profile = profileRepository.save(profile);
        return convertToDTO(profile, user);
    }
    
    private ProfileDTO convertToDTO(Profile profile, User user) {
        ProfileDTO dto = new ProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setBio(profile.getBio());
        dto.setLocation(profile.getLocation());
        dto.setPhone(profile.getPhone());
        dto.setWebsite(profile.getWebsite());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setMemberSince(user.getCreatedAt());
        
        // Get statistics
        dto.setTotalNotes(noteRepository.countByUser(user));
        dto.setTotalFiles(fileMetadataRepository.countByUserId(user.getId()));
        dto.setTotalBoardLinks(0L); // TODO: Implement board links count when available
        
        return dto;
    }
}
