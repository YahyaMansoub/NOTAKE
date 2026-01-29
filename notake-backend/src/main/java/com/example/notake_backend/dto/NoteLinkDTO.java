package com.example.notake_backend.dto;

public class NoteLinkDTO {
    private Long id;
    private Long sourceNoteId;
    private Long targetNoteId;
    private String createdAt;
    
    // Constructors
    public NoteLinkDTO() {}
    
    public NoteLinkDTO(Long id, Long sourceNoteId, Long targetNoteId, String createdAt) {
        this.id = id;
        this.sourceNoteId = sourceNoteId;
        this.targetNoteId = targetNoteId;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSourceNoteId() {
        return sourceNoteId;
    }
    
    public void setSourceNoteId(Long sourceNoteId) {
        this.sourceNoteId = sourceNoteId;
    }
    
    public Long getTargetNoteId() {
        return targetNoteId;
    }
    
    public void setTargetNoteId(Long targetNoteId) {
        this.targetNoteId = targetNoteId;
    }
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
