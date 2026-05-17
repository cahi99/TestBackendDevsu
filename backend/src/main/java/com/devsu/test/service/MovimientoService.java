package com.devsu.test.service;

import com.devsu.test.dto.ReporteDTO;
import com.devsu.test.entity.Movimiento;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoService {
    List<Movimiento> findAll();
    Movimiento findById(Long id);
    Movimiento save(Movimiento movimiento);
    List<ReporteDTO> generarReporte(LocalDateTime fechaInicio, LocalDateTime fechaFin, Long clienteId);
}