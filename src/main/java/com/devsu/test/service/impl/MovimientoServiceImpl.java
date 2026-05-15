package com.devsu.test.service.impl;

import com.devsu.test.dto.ReporteDTO;
import com.devsu.test.entity.Cuenta;
import com.devsu.test.entity.Movimiento;
import com.devsu.test.exception.BusinessException;
import com.devsu.test.exception.ResourceNotFoundException;
import com.devsu.test.repository.CuentaRepository;
import com.devsu.test.repository.MovimientoRepository;
import com.devsu.test.service.MovimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovimientoServiceImpl implements MovimientoService {

    private final MovimientoRepository movimientoRepository;
    private final CuentaRepository cuentaRepository;

    private static final BigDecimal LIMITE_DIARIO_RETIRO = new BigDecimal("1000.00");

    @Override
    public List<Movimiento> findAll() {
        return movimientoRepository.findAll();
    }

    @Override
    public Movimiento findById(Long id) {
        return movimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento no encontrado con ID: " + id));
    }

    @Override
    @Transactional
    public Movimiento save(Movimiento movimiento) {
        if (movimiento.getCuenta() == null || movimiento.getCuenta().getNumeroCuenta() == null) {
            throw new BusinessException("El movimiento debe estar asociado a una cuenta válida.");
        }

        Cuenta cuenta = cuentaRepository.findById(movimiento.getCuenta().getNumeroCuenta())
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada."));

        if (movimiento.getValor() == null || movimiento.getValor().compareTo(BigDecimal.ZERO) == 0) {
            throw new BusinessException("El valor del movimiento no puede ser cero o nulo.");
        }

        BigDecimal valorMovimiento = movimiento.getValor();
        BigDecimal saldoActual = obtenerSaldoActual(cuenta.getNumeroCuenta());

        // Validaciones para retiros (valores negativos)
        if (valorMovimiento.compareTo(BigDecimal.ZERO) < 0) {
            
            // 1. Validar Saldo Disponible
            if (saldoActual.compareTo(valorMovimiento.abs()) < 0) {
                throw new BusinessException("Saldo no disponible");
            }

            // 2. Validar Límite Diario
            LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime finDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
            
            BigDecimal retirosHoy = movimientoRepository.sumRetirosByCuentaAndFecha(cuenta.getNumeroCuenta(), inicioDia, finDia);
            BigDecimal totalRetirosIntento = retirosHoy.abs().add(valorMovimiento.abs());

            if (totalRetirosIntento.compareTo(LIMITE_DIARIO_RETIRO) > 0) {
                throw new BusinessException("Cupo diario Excedido");
            }
            
            movimiento.setTipoMovimiento("Retiro");
        } else {
            movimiento.setTipoMovimiento("Depósito");
        }

        // Calcular nuevo saldo
        BigDecimal nuevoSaldo = saldoActual.add(valorMovimiento);
        
        // Preparar y guardar la entidad Movimiento
        movimiento.setFecha(LocalDateTime.now());
        movimiento.setSaldo(nuevoSaldo);
        movimiento.setCuenta(cuenta);

        return movimientoRepository.save(movimiento);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReporteDTO> generarReporte(LocalDateTime fechaInicio, LocalDateTime fechaFin, Long clienteId) {
        List<Movimiento> movimientos = movimientoRepository.findMovimientosByClienteAndFecha(clienteId, fechaInicio, fechaFin);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return movimientos.stream().map(m -> ReporteDTO.builder()
                .fecha(m.getFecha().format(formatter))
                .cliente(m.getCuenta().getCliente().getNombre())
                .numeroCuenta(m.getCuenta().getNumeroCuenta())
                .tipo(m.getCuenta().getTipoCuenta())
                .saldoInicial(m.getCuenta().getSaldoInicial())
                .estado(m.getCuenta().getEstado())
                .movimiento(m.getValor())
                .saldoDisponible(m.getSaldo())
                .build()
        ).collect(Collectors.toList());
    }

    private BigDecimal obtenerSaldoActual(String numeroCuenta) {
        return movimientoRepository.findLastMovimientoByCuenta(numeroCuenta)
                .map(Movimiento::getSaldo)
                .orElseGet(() -> cuentaRepository.findById(numeroCuenta).get().getSaldoInicial());
    }
}