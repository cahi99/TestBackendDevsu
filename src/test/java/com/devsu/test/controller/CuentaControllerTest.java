package com.devsu.test.controller;

import com.devsu.test.entity.Cuenta;
import com.devsu.test.service.CuentaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CuentaController.class)
class CuentaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CuentaService cuentaService;

    @Autowired
    private ObjectMapper objectMapper;

    private Cuenta cuentaMock;

    @BeforeEach
    void setUp() {
        cuentaMock = new Cuenta();
        cuentaMock.setNumeroCuenta("123456");
        cuentaMock.setTipoCuenta("Ahorro");
        cuentaMock.setSaldoInicial(new BigDecimal("1000.00"));
        cuentaMock.setEstado(true);
    }

    @Test
    void listarCuentas_DebeRetornarLista() throws Exception {
        when(cuentaService.findAll()).thenReturn(Arrays.asList(cuentaMock));

        mockMvc.perform(get("/cuentas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].numeroCuenta").value("123456"));
    }

    @Test
    void obtenerCuenta_DebeRetornarCuenta() throws Exception {
        when(cuentaService.findById("123456")).thenReturn(cuentaMock);

        mockMvc.perform(get("/cuentas/123456"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipoCuenta").value("Ahorro"));
    }

    @Test
    void crearCuenta_DebeRetornarCreated() throws Exception {
        when(cuentaService.save(any(Cuenta.class))).thenReturn(cuentaMock);

        mockMvc.perform(post("/cuentas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cuentaMock)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.saldoInicial").value(1000.00));
    }
}