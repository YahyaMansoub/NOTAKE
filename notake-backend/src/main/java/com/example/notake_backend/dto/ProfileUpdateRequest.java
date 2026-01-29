package com.example.notake_backend.dto;

public class ProfileUpdateRequest {
    private String bio;
    private String location;
    private String phone;
    private String website;
    private String dateOfBirth; // ISO format string
    
    // Constructors
    public ProfileUpdateRequest() {}
    
    // Getters and Setters
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
    
    public String getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
}
