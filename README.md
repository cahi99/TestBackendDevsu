# Devsu Backend Test - Solución

Este repositorio contiene la solución a la prueba técnica de Backend para Devsu, desarrollada con Java 17 y Spring Boot 3. Se han implementado estándares de la industria, incluyendo Clean Architecture, diseño RESTful, manejo transaccional atómico y documentación interactiva.

## Arquitectura y Tecnologías
- **Java 17** y **Spring Boot 3.2.x**
- **Spring Data JPA** (Hibernate) con patrón de herencia `JOINED`.
- **H2 Database** (Base de datos en memoria Zero-Config).
- **JUnit 5 & Mockito** (Cobertura de pruebas unitarias sobre servicios y controladores).
- **Docker & Docker Compose** (Contenedorización Multi-stage).
- **Swagger / OpenAPI 3** (Documentación interactiva de la API).
- **Lombok**

## Estructura del Proyecto
El proyecto sigue principios de Clean Architecture y SOLID:
- `controller/`: Endpoints RESTful (`/clientes`, `/cuentas`, `/movimientos`, `/reportes`).
- `service/`: Lógica de negocio, control de límites diarios y validación de saldos (`@Transactional`).
- `repository/`: Interfaces de acceso a datos (Patrón Repository).
- `entity/`: Modelos del dominio fuertemente tipados.
- `exception/`: Manejador global de excepciones (`@ControllerAdvice`).
- `dto/`: Objetos de Transferencia de Datos.
- `config/`: Configuración de CORS y seguridad.

## Ejecución "Zero-Config" con Docker

La aplicación está preparada para ejecutarse sin necesidad de instalar Maven o Java en la máquina host.

1. Asegúrate de tener instalado [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/).
2. Levanta el contenedor en la raíz del proyecto:
   ```bash
   docker-compose up --build -d
   ```
3. La API estará disponible en `http://localhost:8080/api`.

*(Nota: Al iniciar, el contenedor ejecutará automáticamente el script `BaseDatos.sql` poblando la base de datos con los clientes y cuentas iniciales).*

## Documentación y Consolas

- **Swagger UI (Documentación Interactiva):**
  `http://localhost:8080/api/swagger-ui/index.html`
- **Consola H2 Database:**
  `http://localhost:8080/api/h2-console`
  - **JDBC URL:** `jdbc:h2:mem:devsudb`
  - **User Name:** `sa`
  - **Password:** *(vacío)*

## Pruebas Automatizadas

El proyecto cuenta con una sólida suite de pruebas unitarias cubriendo las reglas de negocio (fondos insuficientes, límite diario excedido) y los endpoints HTTP.
Para ejecutar los test localmente:
```bash
./mvnw clean test
```