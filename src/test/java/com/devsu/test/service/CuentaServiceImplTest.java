package com.devsu.test.service;

import com.devsu.test.entity.Cliente;
import com.devsu.test.entity.Cuenta;
import com.devsu.test.exception.ResourceNotFoundException;
import com.devsu.test.repository.CuentaRepository;
import com.devsu.test.service.impl.CuentaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CuentaServiceImplTest {

    @Mock
    private CuentaRepository cuentaRepository;

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private CuentaServiceImpl cuentaService;

    private Cuenta cuentaMock;
    private Cliente clienteMock;

    @BeforeEach
    void setUp() {
        clienteMock = new Cliente();
        clienteMock.setId(1L);

        cuentaMock = new Cuenta();
        cuentaMock.setNumeroCuenta("55555");
        cuentaMock.setTipoCuenta("Corriente");
        cuentaMock.setSaldoInicial(new BigDecimal("500.00"));
        cuentaMock.setCliente(clienteMock);
    }

    @Test
    void findAll_DebeRetornarLista() {
        when(cuentaRepository.findAll()).thenReturn(Arrays.asList(cuentaMock));
        
        List<Cuenta> cuentas = cuentaService.findAll();
        
        assertFalse(cuentas.isEmpty());
        assertEquals("55555", cuentas.get(0).getNumeroCuenta());
    }

    @Test
    void findById_DebeRetornarCuentaSiExiste() {
        when(cuentaRepository.findById("55555")).thenReturn(Optional.of(cuentaMock));
        
        Cuenta resultado = cuentaService.findById("55555");
        
        assertNotNull(resultado);
        assertEquals("Corriente", resultado.getTipoCuenta());
    }

    @Test
    void save_DebeAsociarClienteYGuardar() {
        when(clienteService.findById(1L)).thenReturn(clienteMock);
        when(cuentaRepository.save(any(Cuenta.class))).thenReturn(cuentaMock);
        
        Cuenta resultado = cuentaService.save(cuentaMock);
        
        assertNotNull(resultado.getCliente());
        verify(clienteService, times(1)).findById(1L);
        verify(cuentaRepository, times(1)).save(cuentaMock);
    }
    
    @Test
    void delete_DebeEliminarCuenta() {
        when(cuentaRepository.findById("55555")).thenReturn(Optional.of(cuentaMock));
        doNothing().when(cuentaRepository).delete(any(Cuenta.class));
        
        cuentaService.delete("55555");
        
        verify(cuentaRepository, times(1)).delete(cuentaMock);
    }
}