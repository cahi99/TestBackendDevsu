package com.devsu.test.service.impl;

import com.devsu.test.entity.Cliente;
import com.devsu.test.entity.Cuenta;
import com.devsu.test.exception.ResourceNotFoundException;
import com.devsu.test.repository.CuentaRepository;
import com.devsu.test.service.ClienteService;
import com.devsu.test.service.CuentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaServiceImpl implements CuentaService {

    private final CuentaRepository cuentaRepository;
    private final ClienteService clienteService;

    @Override
    public List<Cuenta> findAll() {
        return cuentaRepository.findAll();
    }

    @Override
    public Cuenta findById(String numeroCuenta) {
        return cuentaRepository.findById(numeroCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada con número: " + numeroCuenta));
    }

    @Override
    public Cuenta save(Cuenta cuenta) {
        if (cuenta.getCliente() != null && cuenta.getCliente().getId() != null) {
            Cliente cliente = clienteService.findById(cuenta.getCliente().getId());
            cuenta.setCliente(cliente);
        }
        return cuentaRepository.save(cuenta);
    }

    @Override
    public Cuenta update(String numeroCuenta, Cuenta cuenta) {
        Cuenta cuentaExistente = findById(numeroCuenta);
        cuentaExistente.setTipoCuenta(cuenta.getTipoCuenta());
        cuentaExistente.setEstado(cuenta.getEstado());
        
        // No permitimos actualizar el saldo inicial ni el número de cuenta aquí
        
        if (cuenta.getCliente() != null && cuenta.getCliente().getId() != null) {
            Cliente cliente = clienteService.findById(cuenta.getCliente().getId());
            cuentaExistente.setCliente(cliente);
        }
        
        return cuentaRepository.save(cuentaExistente);
    }

    @Override
    public void delete(String numeroCuenta) {
        Cuenta cuenta = findById(numeroCuenta);
        cuentaRepository.delete(cuenta);
    }
}