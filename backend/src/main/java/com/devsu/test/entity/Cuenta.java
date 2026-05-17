package com.devsu.test.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
public class Cuenta {

    @Id
    @NotBlank(message = "El número de cuenta es obligatorio")
    private String numeroCuenta;

    @NotBlank(message = "El tipo de cuenta es obligatorio")
    private String tipoCuenta;
    
    @NotNull(message = "El saldo inicial es obligatorio")
    private BigDecimal saldoInicial;

    private Boolean estado;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
}