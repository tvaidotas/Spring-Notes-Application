package com.qa.controllers;

import com.qa.models.Note;
import com.qa.repository.NotesRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@CrossOrigin()
public class NotesController {

    private final NotesRepository repository;

    public NotesController(NotesRepository repository) {
        this.repository = repository;
    }

    @GetMapping("notes")
    public List<Note> listAllNotes() {
        return repository.findAll();
    }

    @PostMapping("notes")
    public Note addNote(@RequestBody Note note) {
        return repository.saveAndFlush(note);
    }

    @GetMapping("notes/{id}")
    public Note getNote(@PathVariable Long id) throws Exception {
        return repository.findById(id).orElseThrow(() -> new Exception("Could not find Note"));
    }

    @PutMapping("notes/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) throws Exception {
        Note update = getNote(id);
        update.setStatus(note.getStatus());
        update.setDescription(note.getDescription());
        return repository.save(update);
    }

    @DeleteMapping("notes/{id}")
    public Note deleteNote(@PathVariable Long id) throws Exception {
        Note existing = repository.findById(id).orElseThrow(() -> new Exception("Could not delete Note"));
        repository.delete(existing);
        return existing;
    }

    @GetMapping("notes/searchByKey/{key}")
    public List<Note> searchForNotesByKey(@PathVariable String key) {
        List<Note> notesFound = repository
                .findAll()
                .stream()
                .filter(note -> note.getDescription().toLowerCase().contains(key.toLowerCase()))
                .collect(Collectors.toList());
        if (notesFound.isEmpty()) {
            return Collections.emptyList();
        } else {
            return notesFound;
        }
    }

    @GetMapping("notes/searchByStatus/{status}")
    public List<Note> searchForNotesByStatus(@PathVariable String status) {
        List<Note> notesFound = repository
                .findAll()
                .stream()
                .filter(note -> Objects.equals(note.getStatus(), status))
                .collect(Collectors.toList());
        if (notesFound.isEmpty()) {
            return Collections.emptyList();
        } else {
            return notesFound;
        }
    }

    @GetMapping("notes/searchByToday")
    public List<Note> searchForNotesByStatus() {
        List<Note> notesFound = repository
                .findAll()
                .stream()
                .filter(note -> note.getCreationDate().equals(LocalDate.now()))
                .collect(Collectors.toList());
        if (notesFound.isEmpty()) {
            return Collections.emptyList();
        } else {
            return notesFound;
        }
    }

}
