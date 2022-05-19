package com.qa.controllers;

import com.qa.models.Note;
import com.qa.repository.NotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin()
public class NotesController {

    @Autowired
    private NotesRepository repository;

    @RequestMapping(value = "notes", method = RequestMethod.GET)
    public List<Note> listAllNotes() {
        return repository.findAll();
    }

    @RequestMapping(value = "notes", method = RequestMethod.POST)
    public Note addNote(@RequestBody Note note) {
        return repository.saveAndFlush(note);
    }

    @RequestMapping(value = "notes/{id}", method = RequestMethod.GET)
    public Note getNote(@PathVariable Long id) throws Exception {
        return repository.findById(id).orElseThrow(() -> new Exception("Could not find Note"));
    }

    @RequestMapping(value = "notes/{id}", method = RequestMethod.PUT)
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) throws Exception {
        Note update = getNote(id);
        update.setStatus(note.getStatus());
        return repository.save(update);
    }

    @RequestMapping(value = "notes/{id}", method = RequestMethod.DELETE)
    public Note deleteNote(@PathVariable Long id) throws Exception {
        Note existing = repository.findById(id).orElseThrow(() -> new Exception("Could not delete Note"));
        repository.delete(existing);
        return existing;
    }

}
