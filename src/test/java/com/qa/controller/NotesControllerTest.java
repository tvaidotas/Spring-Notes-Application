package com.qa.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qa.controllers.NotesController;
import com.qa.models.Note;
import com.qa.repository.NotesRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@WebMvcTest(NotesController.class)
public class NotesControllerTest {

    @Autowired
	private MockMvc mockMvc;
    
    @MockBean
    private NotesRepository repository;

    @Test
    public void testGetAllNotes() throws Exception {

        List<Note> expectedNotesList = new ArrayList<>();
        Note note = new Note();
        note.setDescription("blah");
        note.setStatus("NEW");
        expectedNotesList.add(note);

        when(repository.findAll()).thenReturn(expectedNotesList);
        
		MvcResult result = this.mockMvc.perform(get("/notes"))
        .andExpect(status().isOk())
        .andReturn();

        assertNotNull(result);

        ObjectMapper mapper = new ObjectMapper();

        List<Note> actual = mapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<Note>>() {});

        assertEquals(expectedNotesList.size(), actual.size());
    }

    @Test
    public void addNote() throws Exception {
        Note note = new Note();
        note.setDescription("foo");
        note.setStatus("NEW");

        when(repository.saveAndFlush(any())).thenReturn(note);

        MvcResult result = this.mockMvc.perform(post("/notes")
            .content(asJsonString(note))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk())
        .andReturn();

        assertNotNull(result);
        verify(repository, times(1)).saveAndFlush(ArgumentMatchers.refEq(note));

        ObjectMapper mapper = new ObjectMapper();
        Note actual = mapper.readValue(result.getResponse().getContentAsString(), Note.class);

        assertEquals(note.getDescription(), actual.getDescription());
        assertEquals(note.getStatus(), actual.getStatus());
    }


    @Test
    public void updateNote() throws Exception {
        Long exampleId = 1l;

        Note noteBefore = new Note();
        noteBefore.setId(exampleId);
        noteBefore.setDescription("foo");
        noteBefore.setStatus("NEW");

        Note noteAfter = new Note();
        noteAfter.setId(exampleId);
        noteAfter.setDescription("foo");
        noteAfter.setStatus("CHECKED");

        when(repository.findById(exampleId)).thenReturn(Optional.of(noteBefore));
        when(repository.save(any())).thenReturn(noteAfter);
       
        MvcResult result = this.mockMvc.perform(put("/notes/1")
            .content(asJsonString(noteAfter))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk())
        .andReturn();

        assertNotNull(result);

        verify(repository, times(1)).findById(eq(exampleId));
        verify(repository, times(1)).save(ArgumentMatchers.refEq(noteAfter));

        ObjectMapper mapper = new ObjectMapper();
        Note actual = mapper.readValue(result.getResponse().getContentAsString(), Note.class);

        assertEquals(noteAfter.getDescription(), actual.getDescription());
        assertEquals(noteAfter.getStatus(), actual.getStatus());
    }


    @Test
    public void deleteNote() throws Exception {
        Long exampleId = 1l;

        Note note = new Note();
        note.setId(exampleId);
        note.setDescription("foo");
        note.setStatus("NEW");

       

        when(repository.findById(exampleId)).thenReturn(Optional.of(note));
       
        MvcResult result = this.mockMvc.perform(delete("/notes/1"))
        .andExpect(status().isOk())
        .andReturn();

        assertNotNull(result);

        verify(repository, times(1)).findById(eq(exampleId));
        verify(repository, times(1)).delete(eq(note));

        ObjectMapper mapper = new ObjectMapper();
        Note actual = mapper.readValue(result.getResponse().getContentAsString(), Note.class);

        assertEquals(note.getDescription(), actual.getDescription());
        assertEquals(note.getStatus(), actual.getStatus());
    }

    @Test
    public void searchForNotesByKey() throws Exception {
        //TODO implement test
    }




    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final String jsonContent = mapper.writeValueAsString(obj);
            return jsonContent;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }  

}
