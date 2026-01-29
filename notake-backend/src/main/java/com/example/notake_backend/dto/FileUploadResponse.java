package com.example.notake_backend.dto;

import com.example.notake_backend.model.FileMetadata.FileCategory;
import java.time.LocalDateTime;

public class FileUploadResponse {
    private Long id;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private String fileUrl;
    private FileCategory category;
    private LocalDateTime uploadDate;
    
    // Constructors
    public FileUploadResponse() {}
    
    public FileUploadResponse(Long id, String fileName, String originalFileName, 
                            String fileType, Long fileSize, String fileUrl, 
                            FileCategory category, LocalDateTime uploadDate) {
        this.id = id;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.fileUrl = fileUrl;
        this.category = category;
        this.uploadDate = uploadDate;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public String getFileUrl() {
        return fileUrl;
    }
    
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
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
}
