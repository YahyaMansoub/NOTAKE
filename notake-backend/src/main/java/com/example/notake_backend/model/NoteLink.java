package com.example.notake_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "note_links")
public class NoteLink {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "source_note_id", nullable = false)
    private Note sourceNote;
    
    @ManyToOne
    @JoinColumn(name = "target_note_id", nullable = false)
    private Note targetNote;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public NoteLink() {}
    
    public NoteLink(Note sourceNote, Note targetNote) {
        this.sourceNote = sourceNote;
        this.targetNote = targetNote;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Note getSourceNote() {
        return sourceNote;
    }
    
    public void setSourceNote(Note sourceNote) {
        this.sourceNote = sourceNote;
    }
    
    public Note getTargetNote() {
        return targetNote;
    }
    
    public void setTargetNote(Note targetNote) {
        this.targetNote = targetNote;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
