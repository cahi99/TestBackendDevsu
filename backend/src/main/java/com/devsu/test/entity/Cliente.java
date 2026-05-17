package com.devsu.test.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@PrimaryKeyJoinColumn(name = "cliente_id")
public class Cliente extends Persona {

    private String contrasena;
    private Boolean estado;
}