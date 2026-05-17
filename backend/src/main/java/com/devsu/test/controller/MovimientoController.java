package com.devsu.test.controller;

import com.devsu.test.entity.Movimiento;
import com.devsu.test.service.MovimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")
@RequiredArgsConstructor
public class MovimientoController {

    private final MovimientoService movimientoService;

    @GetMapping
    public ResponseEntity<List<Movimiento>> listarMovimientos() {
        return ResponseEntity.ok(movimientoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movimiento> obtenerMovimiento(@PathVariable Long id) {
        return ResponseEntity.ok(movimientoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Movimiento> registrarMovimiento(@Valid @RequestBody Movimiento movimiento) {
        Movimiento nuevoMovimiento = movimientoService.save(movimiento);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMovimiento);
    }
}