package com.devsu.test.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ReporteDTO {
    private String fecha;
    private String cliente;
    private String numeroCuenta;
    private String tipo;
    private BigDecimal saldoInicial;
    private Boolean estado;
    private BigDecimal movimiento;
    private BigDecimal saldoDisponible;
}