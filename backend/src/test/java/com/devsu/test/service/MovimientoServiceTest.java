package com.devsu.test.service;

import com.devsu.test.entity.Cuenta;
import com.devsu.test.entity.Movimiento;
import com.devsu.test.exception.BusinessException;
import com.devsu.test.repository.CuentaRepository;
import com.devsu.test.repository.MovimientoRepository;
import com.devsu.test.service.impl.MovimientoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovimientoServiceTest {

    @Mock
    private MovimientoRepository movimientoRepository;

    @Mock
    private CuentaRepository cuentaRepository;

    @InjectMocks
    private MovimientoServiceImpl movimientoService;

    private Cuenta cuentaMock;
    private Movimiento movimientoMock;

    @BeforeEach
    void setUp() {
        cuentaMock = new Cuenta();
        cuentaMock.setNumeroCuenta("478758");
        cuentaMock.setSaldoInicial(new BigDecimal("2000.00"));
        cuentaMock.setEstado(true);

        movimientoMock = new Movimiento();
        movimientoMock.setCuenta(cuentaMock);
    }

    @Test
    void registrarMovimiento_DepositoExitoso() {
        // Arrange
        movimientoMock.setValor(new BigDecimal("500.00"));

        when(cuentaRepository.findById("478758")).thenReturn(Optional.of(cuentaMock));
        when(movimientoRepository.findLastMovimientoByCuenta("478758")).thenReturn(Optional.empty()); // No hay mov previos
        when(movimientoRepository.save(any(Movimiento.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Movimiento resultado = movimientoService.save(movimientoMock);

        // Assert
        assertNotNull(resultado);
        assertEquals("Depósito", resultado.getTipoMovimiento());
        assertEquals(new BigDecimal("2500.00"), resultado.getSaldo()); // 2000 inicial + 500
        verify(movimientoRepository, times(1)).save(any(Movimiento.class));
    }

    @Test
    void registrarMovimiento_RetiroFalla_SaldoNoDisponible() {
        // Arrange
        movimientoMock.setValor(new BigDecimal("-2500.00")); // Intenta retirar 2500, pero solo hay 2000

        when(cuentaRepository.findById("478758")).thenReturn(Optional.of(cuentaMock));
        when(movimientoRepository.findLastMovimientoByCuenta("478758")).thenReturn(Optional.empty());

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> movimientoService.save(movimientoMock));
        assertEquals("Saldo no disponible", exception.getMessage());
        verify(movimientoRepository, never()).save(any(Movimiento.class));
    }

    @Test
    void registrarMovimiento_RetiroFalla_CupoDiarioExcedido() {
        // Arrange
        movimientoMock.setValor(new BigDecimal("-600.00")); // Retiro solicitado
        
        // Simular que el saldo actual es suficiente (2000)
        when(cuentaRepository.findById("478758")).thenReturn(Optional.of(cuentaMock));
        when(movimientoRepository.findLastMovimientoByCuenta("478758")).thenReturn(Optional.empty());
        
        // Simular que hoy ya retiró 500
        when(movimientoRepository.sumRetirosByCuentaAndFecha(eq("478758"), any(), any()))
                .thenReturn(new BigDecimal("-500.00"));

        // Act & Assert
        // 500 retirados + 600 intentados = 1100 > 1000 de límite
        BusinessException exception = assertThrows(BusinessException.class, () -> movimientoService.save(movimientoMock));
        assertEquals("Cupo diario Excedido", exception.getMessage());
        verify(movimientoRepository, never()).save(any(Movimiento.class));
    }
}