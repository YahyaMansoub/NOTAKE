package com.example.notake_backend.repository;

import com.example.notake_backend.model.FileMetadata;
import com.example.notake_backend.model.FileMetadata.FileCategory;
import com.example.notake_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByUserOrderByUploadDateDesc(User user);
    List<FileMetadata> findByUserIdOrderByUploadDateDesc(Long userId);
    List<FileMetadata> findByUserAndCategory(User user, FileCategory category);
    List<FileMetadata> findByUserIdAndCategory(Long userId, FileCategory category);
    Optional<FileMetadata> findByIdAndUserId(Long id, Long userId);
    List<FileMetadata> findByUserAndFileNameContainingIgnoreCase(User user, String fileName);
    long countByUserId(Long userId);
    long countByUserIdAndCategory(Long userId, FileCategory category);
}
