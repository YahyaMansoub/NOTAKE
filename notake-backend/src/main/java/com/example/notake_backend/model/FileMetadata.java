package com.example.notake_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_metadata")
public class FileMetadata {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String originalFileName;
    
    @Column(nullable = false)
    private String fileType;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Column(nullable = false)
    private String filePath;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileCategory category;
    
    @Column(name = "upload_date", nullable = false, updatable = false)
    private LocalDateTime uploadDate;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enum for file categories
    public enum FileCategory {
        DOCUMENT, IMAGE, VIDEO, AUDIO, OTHER
    }
    
    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        // Auto-detect category based on file type
        if (category == null) {
            category = detectCategory(fileType);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    private FileCategory detectCategory(String fileType) {
        if (fileType == null) return FileCategory.OTHER;
        
        String type = fileType.toLowerCase();
        if (type.startsWith("image/")) return FileCategory.IMAGE;
        if (type.startsWith("video/")) return FileCategory.VIDEO;
        if (type.startsWith("audio/")) return FileCategory.AUDIO;
        if (type.contains("pdf") || type.contains("document") || 
            type.contains("text") || type.contains("word") || 
            type.contains("excel") || type.contains("powerpoint")) {
            return FileCategory.DOCUMENT;
        }
        return FileCategory.OTHER;
    }
    
    // Constructors
    public FileMetadata() {}
    
    public FileMetadata(User user, String fileName, String originalFileName, 
                       String fileType, Long fileSize, String filePath) {
        this.user = user;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getOriginalFileName() {
        return originalFileName;
    }
    
    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public FileCategory getCategory() {
        return category;
    }
    
    public void setCategory(FileCategory category) {
        this.category = category;
    }
    
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
