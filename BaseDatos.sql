-- Insertar Datos de Clientes (Persona y Cliente)
-- Jose Lema
INSERT INTO persona (id, nombre, direccion, telefono, edad, genero, identificacion) VALUES (1, 'Jose Lema', 'Otavalo sn y principal', '098254785', 30, 'Masculino', '1000000001');
INSERT INTO cliente (cliente_id, contrasena, estado) VALUES (1, '1234', true);

-- Marianela Montalvo
INSERT INTO persona (id, nombre, direccion, telefono, edad, genero, identificacion) VALUES (2, 'Marianela Montalvo', 'Amazonas y NNUU', '097548965', 28, 'Femenino', '1000000002');
INSERT INTO cliente (cliente_id, contrasena, estado) VALUES (2, '5678', true);

-- Juan Osorio
INSERT INTO persona (id, nombre, direccion, telefono, edad, genero, identificacion) VALUES (3, 'Juan Osorio', '13 junio y Equinoccial', '098874587', 35, 'Masculino', '1000000003');
INSERT INTO cliente (cliente_id, contrasena, estado) VALUES (3, '1245', true);

-- Ajustar las secuencias autoincrementales de H2 para evitar colisiones con los IDs insertados manualmente
ALTER TABLE persona ALTER COLUMN id RESTART WITH 4;

-- Insertar Datos de Cuentas
INSERT INTO cuenta (numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) VALUES ('478758', 'Ahorro', 2000.00, true, 1);
INSERT INTO cuenta (numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) VALUES ('225487', 'Corriente', 100.00, true, 2);
INSERT INTO cuenta (numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) VALUES ('495878', 'Ahorro', 0.00, true, 3);
INSERT INTO cuenta (numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) VALUES ('496825', 'Ahorro', 540.00, true, 2);
INSERT INTO cuenta (numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) VALUES ('585545', 'Corriente', 1000.00, true, 1);