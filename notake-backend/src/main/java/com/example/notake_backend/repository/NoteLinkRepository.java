package com.example.notake_backend.repository;

import com.example.notake_backend.model.Note;
import com.example.notake_backend.model.NoteLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteLinkRepository extends JpaRepository<NoteLink, Long> {
    
    // Find all links where the source note belongs to a specific user
    @Query("SELECT nl FROM NoteLink nl WHERE nl.sourceNote.user.id = :userId")
    List<NoteLink> findByUserId(@Param("userId") Long userId);
    
    // Find links by source note
    List<NoteLink> findBySourceNote(Note sourceNote);
    
    // Find links by target note
    List<NoteLink> findByTargetNote(Note targetNote);
    
    // Check if a link already exists
    boolean existsBySourceNoteAndTargetNote(Note sourceNote, Note targetNote);
    
    // Delete link between two notes
    void deleteBySourceNoteAndTargetNote(Note sourceNote, Note targetNote);
}
