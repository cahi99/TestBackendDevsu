package com.devsu.test.repository;

import com.devsu.test.entity.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, String> {
    List<Cuenta> findByClienteId(Long clienteId);
}