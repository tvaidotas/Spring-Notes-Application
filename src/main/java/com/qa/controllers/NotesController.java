package com.qa.controllers;

import com.qa.models.Note;
import com.qa.repository.NotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        return repository.save(update);
    }

    @DeleteMapping("notes/{id}")
    public Note deleteNote(@PathVariable Long id) throws Exception {
        Note existing = repository.findById(id).orElseThrow(() -> new Exception("Could not delete Note"));
        repository.delete(existing);
        return existing;
    }

}
