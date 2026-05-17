package com.devsu.test.controller;

import com.devsu.test.entity.Cliente;
import com.devsu.test.service.ClienteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClienteController.class)
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClienteService clienteService;

    @Autowired
    private ObjectMapper objectMapper;

    private Cliente clienteMock;

    @BeforeEach
    void setUp() {
        clienteMock = new Cliente();
        clienteMock.setId(1L);
        clienteMock.setNombre("Prueba Cliente");
        clienteMock.setIdentificacion("1234567890");
        clienteMock.setGenero("Masculino");
        clienteMock.setEdad(30);
        clienteMock.setDireccion("Calle Falsa 123");
        clienteMock.setTelefono("0999999999");
        clienteMock.setContrasena("1234");
        clienteMock.setEstado(true);
    }

    @Test
    void listarClientes_DebeRetornarLista() throws Exception {
        when(clienteService.findAll()).thenReturn(Arrays.asList(clienteMock));

        mockMvc.perform(get("/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Prueba Cliente"));
    }

    @Test
    void obtenerCliente_DebeRetornarCliente() throws Exception {
        when(clienteService.findById(1L)).thenReturn(clienteMock);

        mockMvc.perform(get("/clientes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.identificacion").value("1234567890"));
    }

    @Test
    void crearCliente_DebeRetornarCreated() throws Exception {
        when(clienteService.save(any(Cliente.class))).thenReturn(clienteMock);

        mockMvc.perform(post("/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteMock)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Prueba Cliente"));
    }
}