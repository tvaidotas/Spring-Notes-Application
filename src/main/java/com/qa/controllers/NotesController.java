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
    public List<Note> listAllNotes(){
        return repository.findAll();
    }

    @RequestMapping(value = "notes", method = RequestMethod.POST)
    public Note addNote(@RequestBody Note note){
        return repository.saveAndFlush(note);
    }

    @RequestMapping(value = "notes/{id}", method = RequestMethod.GET)
    public Note getNote(@PathVariable Long id){
        return repository.findOne(id);
    }

    @RequestMapping(value = "notes/{id}", method = RequestMethod.DELETE)
    public Note deleteNote(@PathVariable Long id){
        Note existing = repository.findOne(id);
        repository.delete(existing);
        return existing;
    }

}
