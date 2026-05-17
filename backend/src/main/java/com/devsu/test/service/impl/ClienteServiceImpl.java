package com.devsu.test.service.impl;

import com.devsu.test.entity.Cliente;
import com.devsu.test.exception.ResourceNotFoundException;
import com.devsu.test.repository.ClienteRepository;
import com.devsu.test.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    @Override
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente findById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
    }

    @Override
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente update(Long id, Cliente cliente) {
        Cliente clienteExistente = findById(id);
        clienteExistente.setNombre(cliente.getNombre());
        clienteExistente.setGenero(cliente.getGenero());
        clienteExistente.setEdad(cliente.getEdad());
        clienteExistente.setIdentificacion(cliente.getIdentificacion());
        clienteExistente.setDireccion(cliente.getDireccion());
        clienteExistente.setTelefono(cliente.getTelefono());
        clienteExistente.setContrasena(cliente.getContrasena());
        clienteExistente.setEstado(cliente.getEstado());
        
        return clienteRepository.save(clienteExistente);
    }

    @Override
    public void delete(Long id) {
        Cliente cliente = findById(id);
        clienteRepository.delete(cliente);
    }
}