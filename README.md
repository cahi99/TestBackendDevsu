# Devsu Backend Test - Solución

Este repositorio contiene la solución a la prueba técnica de Backend para Devsu, desarrollada con Java 17 y Spring Boot 3.

## Arquitectura y Tecnologías
- **Java 17** y **Spring Boot 3.2.x**
- **Spring Data JPA** (Hibernate)
- **H2 Database** (Base de datos en memoria para pruebas rápidas)
- **JUnit 5 & Mockito** (Pruebas Unitarias)
- **Docker & Docker Compose** (Contenedorización)
- **Lombok**

## Estructura del Proyecto
El proyecto sigue principios de Clean Architecture y SOLID:
- `controller/`: Endpoints RESTful.
- `service/`: Lógica de negocio e interfaces.
- `repository/`: Interfaces de acceso a datos (Patrón Repository).
- `entity/`: Modelos del dominio.
- `exception/`: Manejador global de excepciones (`@ControllerAdvice`).
- `dto/`: Objetos de Transferencia de Datos.

## Ejecución con Docker

1. Asegúrate de tener instalado [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/).
2. Compila el proyecto generando el `.jar` ejecutable:
   ```bash
   ./mvnw clean package -DskipTests
   ```
3. Levanta el contenedor usando Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
4. La API estará disponible en `http://localhost:8080`.

## Base de Datos H2
- Por defecto, el sistema se inicializa con los datos provistos en el archivo `BaseDatos.sql`.
- Consola de H2: `http://localhost:8080/h2-console`
  - **JDBC URL:** `jdbc:h2:mem:devsudb`
  - **User Name:** `sa`
  - **Password:** *(vacío)*

## Pruebas
Para ejecutar los test automatizados (incluyendo las validaciones de límite diario y saldo), ejecuta:
```bash
./mvnw test
```