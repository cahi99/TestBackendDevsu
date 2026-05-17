package com.devsu.test.controller;

import com.devsu.test.entity.Cliente;
import com.devsu.test.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Cliente> crearCliente(@Valid @RequestBody Cliente cliente) {
        Cliente nuevoCliente = clienteService.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long id, @Valid @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.update(id, cliente));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Cliente> actualizacionParcialCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
        // Para simplificar, en este scope lo tratamos similar al update completo,
        // aunque idealmente un PATCH solo actualiza campos no nulos.
        return ResponseEntity.ok(clienteService.update(id, cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        clienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}