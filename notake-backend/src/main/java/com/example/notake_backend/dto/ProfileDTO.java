package com.example.notake_backend.dto;

import java.time.LocalDateTime;

public class ProfileDTO {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String profileImageUrl;
    private String bio;
    private String location;
    private String phone;
    private String website;
    private LocalDateTime dateOfBirth;
    private LocalDateTime memberSince;
    private Long totalNotes;
    private Long totalFiles;
    private Long totalBoardLinks;
    
    // Constructors
    public ProfileDTO() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getWebsite() {
        return website;
    }
    
    public void setWebsite(String website) {
        this.website = website;
    }
    
    public LocalDateTime getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDateTime dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public LocalDateTime getMemberSince() {
        return memberSince;
    }
    
    public void setMemberSince(LocalDateTime memberSince) {
        this.memberSince = memberSince;
    }
    
    public Long getTotalNotes() {
        return totalNotes;
    }
    
    public void setTotalNotes(Long totalNotes) {
        this.totalNotes = totalNotes;
    }
    
    public Long getTotalFiles() {
        return totalFiles;
    }
    
    public void setTotalFiles(Long totalFiles) {
        this.totalFiles = totalFiles;
    }
    
    public Long getTotalBoardLinks() {
        return totalBoardLinks;
    }
    
    public void setTotalBoardLinks(Long totalBoardLinks) {
        this.totalBoardLinks = totalBoardLinks;
    }
}
