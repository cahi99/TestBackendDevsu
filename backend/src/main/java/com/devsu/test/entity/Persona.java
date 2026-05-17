package com.devsu.test.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    private String genero;
    
    @NotNull(message = "La edad es obligatoria")
    @Min(value = 18, message = "Debe ser mayor de edad")
    private Integer edad;
    
    @NotBlank(message = "La identificación es obligatoria")
    private String identificacion;
    
    private String direccion;

    private String telefono;
}