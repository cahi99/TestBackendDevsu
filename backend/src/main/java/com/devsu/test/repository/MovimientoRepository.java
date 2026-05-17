package com.devsu.test.repository;

import com.devsu.test.entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    @Query("SELECT COALESCE(SUM(m.valor), 0) FROM Movimiento m WHERE m.cuenta.numeroCuenta = :numeroCuenta AND m.fecha >= :inicioDia AND m.fecha <= :finDia AND m.valor < 0")
    BigDecimal sumRetirosByCuentaAndFecha(@Param("numeroCuenta") String numeroCuenta, @Param("inicioDia") LocalDateTime inicioDia, @Param("finDia") LocalDateTime finDia);

    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.cliente.id = :clienteId AND m.fecha >= :fechaInicio AND m.fecha <= :fechaFin ORDER BY m.fecha DESC")
    List<Movimiento> findMovimientosByClienteAndFecha(
            @Param("clienteId") Long clienteId,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.numeroCuenta = :numeroCuenta ORDER BY m.fecha DESC LIMIT 1")
    Optional<Movimiento> findLastMovimientoByCuenta(@Param("numeroCuenta") String numeroCuenta);
}