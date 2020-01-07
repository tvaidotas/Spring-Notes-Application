//package com.qa.controller;
//
//import com.qa.controllers.NotesController;
//import com.qa.models.Note;
//import com.qa.repository.NotesRepository;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import static org.junit.Assert.assertEquals;
//import static org.mockito.Mockito.when;
//
//@RunWith(SpringRunner.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//public class NotesControllerTest {
//
//    @InjectMocks
//    private NotesController notesController;
//
//    @Mock
//    private NotesRepository repository;
//
//    @Test
//    public void testGetAllNotes(){
//        List<Note> notesList = new ArrayList<>();
//        Note note = new Note();
//        note.setDescription("blah");
//        note.setName("blah");
//        notesList.add(note);
//        when(repository.findAll()).thenReturn(notesList);
//        assertEquals(
//                notesController.listAllNotes().get(0).getName(),
//                "blah"
//        );
//    }
//
//    @Test
//    public void testGetOneNote(){
//        Note note = new Note();
//        note.setName("blah");
//        when(repository.findOne(1L)).thenReturn(note);
//        assertEquals(notesController.getNote(1L).getName(), "blah" );
//    }
//
//
//}
