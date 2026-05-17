# Backend — API RESTful

Este directorio contiene la API RESTful del proyecto, desarrollada con **Java 17** y **Spring Boot 3**. La arquitectura está diseñada para ser robusta, escalable y fácil de mantener, aplicando principios de **Clean Architecture** y **SOLID**.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Lenguaje y Framework | Java 17, Spring Boot 3.2.x |
| Persistencia | Spring Data JPA (Hibernate) |
| Base de Datos | H2 (en memoria, para desarrollo y pruebas) |
| Pruebas | JUnit 5 & Mockito |
| Documentación | Swagger / OpenAPI 3 (springdoc-openapi) |
| Utilidades | Lombok |

---

## 🏛️ Arquitectura y Patrones de Diseño

La API sigue una estricta separación de responsabilidades, aplicando los siguientes patrones:

- **MVC (Model-View-Controller):** Estructura general con `@RestController`, `@Service` y `@Repository`.
- **Repository:** Aislamiento de la capa de acceso a datos mediante interfaces de Spring Data JPA.
- **Builder:** Utilizado en los DTOs para una construcción de objetos limpia y segura.
- **Singleton:** Todos los beans de Spring (`@Service`, `@Component`, etc.) son Singletons por defecto, garantizando una única instancia gestionada por el framework.
- **Strategy (Implícito):** El `GlobalExceptionHandler` actúa como un patrón Strategy, seleccionando el método de manejo de error adecuado según el tipo de excepción lanzada.

---

## ✨ Características Destacadas

- **Transaccionalidad Atómica (ACID):** El servicio de movimientos (`MovimientoServiceImpl`) utiliza `@Transactional` para asegurar que la validación de saldos, el cálculo de límites y la persistencia de datos ocurran como una operación única e indivisible.

- **Validación a Nivel de Modelo:** Se utiliza `jakarta.validation` (`@NotBlank`, `@Min`, `@NotNull`) directamente en las entidades JPA para garantizar la integridad de los datos antes de cualquier operación.

- **Manejo de Excepciones Global:** Una clase `@ControllerAdvice` centraliza todos los errores de negocio (`BusinessException`) y del sistema, devolviendo respuestas JSON estandarizadas.

- **Programación Funcional:** Uso extensivo de la API de Streams y expresiones Lambda para el procesamiento de colecciones y la lógica de mapeo, favoreciendo un código más declarativo e inmutable.

- **Cobertura de Pruebas Completa:** Se incluyen pruebas unitarias para servicios (lógica de negocio) y controladores (MockMvc), asegurando la fiabilidad de cada componente.

---

## ▶️ Ejecución Nativa (Para Desarrollo)

Para levantar únicamente el backend sin Docker:

1. Asegúrate de tener instalado **Java 17** y **Maven**.
2. Desde este directorio (`/backend`), ejecuta:

```bash
./mvnw spring-boot:run
```

La API estará disponible en `http://localhost:8080/api`.

> **Nota:** Si prefieres levantar todo el entorno (backend + frontend) con un solo comando, consulta el `README.md` en la raíz del proyecto para las instrucciones de Docker Compose.

---

## 📚 Endpoints y Documentación

| Recurso | URL |
|---|---|
| **Swagger UI** (Documentación Interactiva) | [http://localhost:8080/api/swagger-ui/index.html](http://localhost:8080/api/swagger-ui/index.html) |
| **Consola H2** (Base de Datos) | [http://localhost:8080/api/h2-console](http://localhost:8080/api/h2-console) |

**Credenciales de la Consola H2:**
- **JDBC URL:** `jdbc:h2:mem:devsudb`
- **User Name:** `sa`
- **Password:** *(vacío)*

---

## 🧪 Pruebas Unitarias

Para ejecutar la suite de pruebas completa:

```bash
./mvnw clean test
```
