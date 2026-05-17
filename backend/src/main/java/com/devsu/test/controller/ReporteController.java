package com.devsu.test.controller;

import com.devsu.test.dto.ReporteDTO;
import com.devsu.test.service.MovimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final MovimientoService movimientoService;

    @GetMapping
    public ResponseEntity<List<ReporteDTO>> generarReporte(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam("clienteId") Long clienteId) {

        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.atTime(23, 59, 59, 999999999);

        List<ReporteDTO> reporte = movimientoService.generarReporte(inicio, fin, clienteId);
        return ResponseEntity.ok(reporte);
    }
}