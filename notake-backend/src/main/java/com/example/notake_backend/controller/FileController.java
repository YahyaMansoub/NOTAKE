package com.example.notake_backend.controller;

import com.example.notake_backend.dto.FileUploadResponse;
import com.example.notake_backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Validate file size (max 50MB)
        if (file.getSize() > 50 * 1024 * 1024) {
            return ResponseEntity.badRequest().build();
        }
        
        String username = authentication.getName();
        FileUploadResponse response = fileStorageService.uploadFile(file, username);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<FileUploadResponse>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files,
            Authentication authentication) {
        
        String username = authentication.getName();
        
        List<FileUploadResponse> responses = new java.util.ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty() && file.getSize() <= 50 * 1024 * 1024) {
                try {
                    FileUploadResponse response = fileStorageService.uploadFile(file, username);
                    responses.add(response);
                } catch (Exception e) {
                    // Log error but continue with other files
                }
            }
        }
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping
    public ResponseEntity<List<FileUploadResponse>> getAllFiles(Authentication authentication) {
        String username = authentication.getName();
        List<FileUploadResponse> files = fileStorageService.getAllFiles(username);
        return ResponseEntity.ok(files);
    }
    
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long fileId,
            Authentication authentication,
            HttpServletRequest request) {
        
        String username = authentication.getName();
        Resource resource = fileStorageService.loadFileAsResource(fileId, username);
        
        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Ignore
        }
        
        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
    
    @GetMapping("/profile/{fileName}")
    public ResponseEntity<Resource> getProfileImage(
            @PathVariable String fileName,
            HttpServletRequest request) {
        
        Resource resource = fileStorageService.loadProfileImage(fileName);
        
        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Ignore
        }
        
        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
    
    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        
        String username = authentication.getName();
        fileStorageService.deleteFile(fileId, username);
        return ResponseEntity.ok().build();
    }
}
