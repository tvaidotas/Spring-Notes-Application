package com.qa.repository;

import java.util.Collection;

import com.qa.models.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotesRepository
        extends JpaRepository<Note, Long> {

        @Query("FROM Note WHERE description LIKE CONCAT('%',:keyword,'%')")
        Collection<Note> searchForNotes(@Param("keyword") String keyword);
}
