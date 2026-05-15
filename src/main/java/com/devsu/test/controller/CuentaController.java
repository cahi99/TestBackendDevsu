package com.devsu.test.controller;

import com.devsu.test.entity.Cuenta;
import com.devsu.test.service.CuentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cuentas")
@RequiredArgsConstructor
public class CuentaController {

    private final CuentaService cuentaService;

    @GetMapping
    public ResponseEntity<List<Cuenta>> listarCuentas() {
        return ResponseEntity.ok(cuentaService.findAll());
    }

    @GetMapping("/{numeroCuenta}")
    public ResponseEntity<Cuenta> obtenerCuenta(@PathVariable String numeroCuenta) {
        return ResponseEntity.ok(cuentaService.findById(numeroCuenta));
    }

    @PostMapping
    public ResponseEntity<Cuenta> crearCuenta(@Valid @RequestBody Cuenta cuenta) {
        Cuenta nuevaCuenta = cuentaService.save(cuenta);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCuenta);
    }

    @PutMapping("/{numeroCuenta}")
    public ResponseEntity<Cuenta> actualizarCuenta(@PathVariable String numeroCuenta, @Valid @RequestBody Cuenta cuenta) {
        return ResponseEntity.ok(cuentaService.update(numeroCuenta, cuenta));
    }

    @PatchMapping("/{numeroCuenta}")
    public ResponseEntity<Cuenta> actualizacionParcialCuenta(@PathVariable String numeroCuenta, @RequestBody Cuenta cuenta) {
        return ResponseEntity.ok(cuentaService.update(numeroCuenta, cuenta));
    }

    @DeleteMapping("/{numeroCuenta}")
    public ResponseEntity<Void> eliminarCuenta(@PathVariable String numeroCuenta) {
        cuentaService.delete(numeroCuenta);
        return ResponseEntity.noContent().build();
    }
}