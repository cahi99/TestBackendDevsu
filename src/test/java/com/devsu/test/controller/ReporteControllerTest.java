package com.devsu.test.controller;

import com.devsu.test.dto.ReporteDTO;
import com.devsu.test.service.MovimientoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReporteController.class)
class ReporteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MovimientoService movimientoService;

    @Test
    void generarReporte_DebeRetornarListaDeReportes() throws Exception {
        ReporteDTO reporte = ReporteDTO.builder()
                .fecha("15/05/2026")
                .cliente("Jose Lema")
                .numeroCuenta("478758")
                .tipo("Ahorro")
                .saldoInicial(new BigDecimal("2000.00"))
                .estado(true)
                .movimiento(new BigDecimal("-500.00"))
                .saldoDisponible(new BigDecimal("1500.00"))
                .build();

        when(movimientoService.generarReporte(any(), any(), eq(1L))).thenReturn(Arrays.asList(reporte));

        mockMvc.perform(get("/reportes")
                .param("fechaInicio", "2026-05-01")
                .param("fechaFin", "2026-05-31")
                .param("clienteId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cliente").value("Jose Lema"))
                .andExpect(jsonPath("$[0].saldoDisponible").value(1500.00));
    }
}