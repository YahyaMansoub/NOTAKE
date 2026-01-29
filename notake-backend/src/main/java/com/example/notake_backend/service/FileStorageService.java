package com.example.notake_backend.service;

import com.example.notake_backend.dto.FileUploadResponse;
import com.example.notake_backend.model.FileMetadata;
import com.example.notake_backend.model.User;
import com.example.notake_backend.repository.FileMetadataRepository;
import com.example.notake_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private Path fileStorageLocation;
    
    public void init() {
        try {
            this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.fileStorageLocation);
            
            // Create subdirectories
            Files.createDirectories(this.fileStorageLocation.resolve("profile-images"));
            Files.createDirectories(this.fileStorageLocation.resolve("user-files"));
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }
    
    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = generateUniqueFileName(originalFileName);
        
        try {
            // Initialize storage if not done
            if (this.fileStorageLocation == null) {
                init();
            }
            
            // Check if file has invalid characters
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Invalid file path sequence " + originalFileName);
            }
            
            // Store file
            Path targetLocation = this.fileStorageLocation.resolve("user-files").resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Save metadata
            FileMetadata metadata = new FileMetadata(
                user,
                fileName,
                originalFileName,
                file.getContentType(),
                file.getSize(),
                targetLocation.toString()
            );
            
            metadata = fileMetadataRepository.save(metadata);
            
            // Create response
            String fileUrl = "/api/files/download/" + metadata.getId();
            return new FileUploadResponse(
                metadata.getId(),
                metadata.getFileName(),
                metadata.getOriginalFileName(),
                metadata.getFileType(),
                metadata.getFileSize(),
                fileUrl,
                metadata.getCategory(),
                metadata.getUploadDate()
            );
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
    
    public String storeProfileImage(MultipartFile file, Long userId) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = "profile_" + userId + "_" + generateUniqueFileName(originalFileName);
        
        try {
            // Initialize storage if not done
            if (this.fileStorageLocation == null) {
                init();
            }
            
            // Check if file has invalid characters
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Invalid file path sequence " + originalFileName);
            }
            
            // Store file
            Path targetLocation = this.fileStorageLocation.resolve("profile-images").resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            return fileName;
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store profile image. Please try again!", ex);
        }
    }
    
    public Resource loadFileAsResource(Long fileId, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        FileMetadata metadata = fileMetadataRepository.findByIdAndUserId(fileId, user.getId())
            .orElseThrow(() -> new RuntimeException("File not found"));
        
        try {
            Path filePath = Paths.get(metadata.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + metadata.getOriginalFileName());
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + metadata.getOriginalFileName(), ex);
        }
    }
    
    public Resource loadProfileImage(String fileName) {
        try {
            // Initialize storage if not done
            if (this.fileStorageLocation == null) {
                init();
            }
            
            Path filePath = this.fileStorageLocation.resolve("profile-images").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Profile image not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Profile image not found " + fileName, ex);
        }
    }
    
    @Transactional
    public List<FileUploadResponse> getAllFiles(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<FileMetadata> files = fileMetadataRepository.findByUserOrderByUploadDateDesc(user);
        
        return files.stream()
            .map(metadata -> new FileUploadResponse(
                metadata.getId(),
                metadata.getFileName(),
                metadata.getOriginalFileName(),
                metadata.getFileType(),
                metadata.getFileSize(),
                "/api/files/download/" + metadata.getId(),
                metadata.getCategory(),
                metadata.getUploadDate()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteFile(Long fileId, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        FileMetadata metadata = fileMetadataRepository.findByIdAndUserId(fileId, user.getId())
            .orElseThrow(() -> new RuntimeException("File not found"));
        
        try {
            // Delete physical file
            Path filePath = Paths.get(metadata.getFilePath());
            Files.deleteIfExists(filePath);
            
            // Delete metadata
            fileMetadataRepository.delete(metadata);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file", ex);
        }
    }
    
    public void deleteFile(String fileUrl) {
        // Helper method to delete file by URL (for profile images)
        try {
            if (fileUrl != null && fileUrl.contains("/")) {
                String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                
                if (this.fileStorageLocation == null) {
                    init();
                }
                
                Path filePath = this.fileStorageLocation.resolve("profile-images").resolve(fileName);
                Files.deleteIfExists(filePath);
            }
        } catch (Exception ex) {
            // Ignore deletion errors
        }
    }
    
    private String generateUniqueFileName(String originalFileName) {
        String extension = "";
        int dotIndex = originalFileName.lastIndexOf(".");
        if (dotIndex > 0) {
            extension = originalFileName.substring(dotIndex);
        }
        return UUID.randomUUID().toString() + extension;
    }
}
