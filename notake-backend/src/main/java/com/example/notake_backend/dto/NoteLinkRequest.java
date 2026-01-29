package com.example.notake_backend.dto;

public class NoteLinkRequest {
    private Long sourceNoteId;
    private Long targetNoteId;
    
    // Constructors
    public NoteLinkRequest() {}
    
    public NoteLinkRequest(Long sourceNoteId, Long targetNoteId) {
        this.sourceNoteId = sourceNoteId;
        this.targetNoteId = targetNoteId;
    }
    
    // Getters and Setters
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
}
