package com.devsu.test.service;

import com.devsu.test.entity.Cliente;
import com.devsu.test.exception.ResourceNotFoundException;
import com.devsu.test.repository.ClienteRepository;
import com.devsu.test.service.impl.ClienteServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceImplTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteServiceImpl clienteService;

    private Cliente clienteMock;

    @BeforeEach
    void setUp() {
        clienteMock = new Cliente();
        clienteMock.setId(1L);
        clienteMock.setNombre("Carlos Prueba");
        clienteMock.setIdentificacion("1111111111");
    }

    @Test
    void findAll_DebeRetornarLista() {
        when(clienteRepository.findAll()).thenReturn(Arrays.asList(clienteMock));
        
        List<Cliente> clientes = clienteService.findAll();
        
        assertFalse(clientes.isEmpty());
        assertEquals(1, clientes.size());
        verify(clienteRepository, times(1)).findAll();
    }

    @Test
    void findById_DebeRetornarClienteSiExiste() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(clienteMock));
        
        Cliente resultado = clienteService.findById(1L);
        
        assertNotNull(resultado);
        assertEquals("Carlos Prueba", resultado.getNombre());
    }

    @Test
    void findById_DebeLanzarExcepcionSiNoExiste() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> clienteService.findById(99L));
    }

    @Test
    void save_DebeGuardarCliente() {
        when(clienteRepository.save(any(Cliente.class))).thenReturn(clienteMock);
        
        Cliente resultado = clienteService.save(clienteMock);
        
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }
}