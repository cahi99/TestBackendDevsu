# Devsu Technical Test - Solución Full Stack

Este repositorio contiene la solución completa de la prueba técnica para Devsu, compuesta por un Backend robusto en Java (Spring Boot) y un Frontend moderno en Angular 17+. Todo el entorno está orquestado a través de Docker para una ejecución "Zero-Config".

## 🚀 Ejecución Rápida con Docker (Zero-Config)

La aplicación está completamente dockerizada. Puedes levantar toda la infraestructura (Base de Datos en memoria, API REST y Aplicación Web) con un solo comando desde la raíz del proyecto:

```bash
docker-compose up --build -d
```

### Accesos:
- 🌐 **Frontend (Aplicación Web):** [http://localhost:4200](http://localhost:4200)
- ⚙️ **Backend (API REST):** `http://localhost:8080/api`
- 📚 **Swagger (Documentación Interactiva):** [http://localhost:8080/api/swagger-ui/index.html](http://localhost:8080/api/swagger-ui/index.html)
- 🗄️ **Consola H2 Database:** [http://localhost:8080/api/h2-console](http://localhost:8080/api/h2-console)
  - *JDBC URL:* `jdbc:h2:mem:devsudb` | *User:* `sa` | *Password:* `(vacío)`

*(Nota: Al iniciar, el backend ejecutará automáticamente el script `BaseDatos.sql` poblando la base de datos con clientes y cuentas de prueba iniciales).*

---

## 💻 Arquitectura del Frontend (Angular 17+)
El Frontend fue construido en la carpeta `/Frontend` aplicando estándares **Senior** y **Clean Architecture**:

- **Core & Routing:** Uso de *Standalone Components*, *Signals* nativos y enrutamiento modularizado con *Lazy Loading* estricto para máxima optimización de la carga.
- **Gestión de Estado (State Management):** Implementación del **Patrón Facade** apoyado fuertemente en **RxJS** (`BehaviorSubject`, `combineLatest`) para desacoplar completamente la lógica de negocio y las peticiones HTTP de la capa visual de los componentes.
- **Rendimiento:** Implementación de `ChangeDetectionStrategy.OnPush` en toda la aplicación para evitar ciclos de detección de cambios innecesarios.
- **UI/UX Custom:** Diseño con estilo *Glassmorphism* construido desde cero con CSS puro (variables `:root` globales), respetando la restricción de no depender de librerías de componentes UI externas (Bootstrap, Angular Material, etc).
- **Formularios:** Formularios Reactivos (`ReactiveFormsModule`) con custom validators y feedback visual en tiempo real.
- **Reportes:** Generación visual y dinámica de Estados de Cuenta con descarga nativa en PDF (renderizado en el lado del cliente con `jsPDF`).
- **Manejo Global de Errores:** Implementación de un `HttpInterceptor` para capturar fallos de red y validaciones del backend, acoplado a un `GlobalErrorHandler` que notifica al usuario elegantemente a través de un servicio de Toasts propio.

---

## ⚙️ Arquitectura del Backend (Java / Spring Boot)
El Backend fue construido en la carpeta `/backend` manteniendo principios SOLID:

- **Tecnologías:** Java 17, Spring Boot 3.2, Spring Data JPA (Hibernate), Lombok.
- **Diseño del Dominio:** Uso de herencia con estrategia `JOINED` para manejar eficientemente entidades como `Persona` y `Cliente`.
- **Lógica de Negocio:** Validación estricta y ejecución atómica (`@Transactional`) para garantizar la consistencia de datos, previniendo saldos negativos y controlando matemáticamente el límite diario de retiros.

---

## 🧪 Pruebas Automatizadas (Testing)
Ambas capas cuentan con infraestructura de pruebas automatizadas:

- **Backend (JUnit 5 & Mockito):** Cobertura de la lógica transaccional y controladores HTTP.
  ```bash
  cd backend && ./mvnw clean test
  ```
- **Frontend (Jest):** Suite moderna configurada con el framework *Jest* (en reemplazo de Karma/Jasmine tradicional).
  ```bash
  cd Frontend && npm run test
  ```