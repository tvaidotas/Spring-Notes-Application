package com.qa.controllers;

import com.qa.models.Note;
import com.qa.repository.NotesRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @PutMapping("notes/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) throws Exception {
        Note update = repository.findById(id).orElseThrow(() -> new Exception("Could not find Note"));
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
        return repository.searchForNotes(key).stream().collect(Collectors.toList());
    }

}
