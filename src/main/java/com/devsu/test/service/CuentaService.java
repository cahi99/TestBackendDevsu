package com.devsu.test.service;

import com.devsu.test.entity.Cuenta;

import java.util.List;

public interface CuentaService {
    List<Cuenta> findAll();
    Cuenta findById(String numeroCuenta);
    Cuenta save(Cuenta cuenta);
    Cuenta update(String numeroCuenta, Cuenta cuenta);
    void delete(String numeroCuenta);
}