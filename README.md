# Devsu Technical Test

Prueba técnica para Devsu. El proyecto es un monorepo con dos módulos independientes: una API REST en Spring Boot y una SPA en Angular, ambos contenerizados con Docker.

## Levantar el entorno

```bash
docker-compose up --build -d
```

- Frontend: http://localhost:4200
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/swagger-ui/index.html
- H2 Console: http://localhost:8080/api/h2-console (`jdbc:h2:mem:devsudb`, user: `sa`, password: vacío)

Al iniciar, el backend ejecuta `BaseDatos.sql` y carga los clientes y cuentas de prueba.

---

## Estructura del proyecto

```
TestBackendDevsu/
├── backend/
│   ├── src/
│   │   ├── main/java/com/devsu/test/
│   │   │   ├── config/           # CorsConfig
│   │   │   ├── controller/       # ClienteController, CuentaController, MovimientoController, ReporteController
│   │   │   ├── dto/              # ReporteDTO
│   │   │   ├── entity/           # Persona, Cliente, Cuenta, Movimiento
│   │   │   ├── exception/        # BusinessException, ResourceNotFoundException, GlobalExceptionHandler
│   │   │   ├── repository/       # ClienteRepository, CuentaRepository, MovimientoRepository
│   │   │   └── service/          # Interfaces + impl/
│   │   └── test/                 # ClienteServiceImplTest, CuentaServiceImplTest, MovimientoServiceTest
│   │                               ClienteControllerTest, CuentaControllerTest, ReporteControllerTest
│   ├── BaseDatos.sql             # Datos iniciales (clientes + cuentas)
│   └── Dockerfile                # Multi-stage: Maven → eclipse-temurin JRE 17
│
├── Frontend/
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── handlers/         # GlobalErrorHandler
│   │   │   ├── interceptors/     # HttpInterceptor
│   │   │   └── services/         # ApiService, ToastService
│   │   └── features/
│   │       ├── clientes/         # ClientesComponent, ClientesFacade
│   │       ├── cuentas/          # CuentasComponent, CuentasFacade
│   │       ├── movimientos/      # MovimientosComponent, MovimientosFacade
│   │       └── reportes/         # ReportesComponent, ReportesFacade
│   ├── setup-jest.ts             # Inicialización de TestBed para Jest
│   ├── jest.config.js
│   ├── nginx.conf                # SPA routing para producción
│   └── Dockerfile                # Multi-stage: Node 20 → Nginx alpine
│
└── docker-compose.yml            # Orquesta backend + frontend

```

---

## Backend (`/backend`)

Java 17 + Spring Boot 3.2 + Spring Data JPA + H2 + Lombok.

La estructura sigue una separación de capas clásica: `controller → service → repository → entity`. Los servicios se acceden a través de interfaces para facilitar el testing con Mockito.

El punto más crítico de la lógica de negocio está en `MovimientoServiceImpl`: la operación de registrar un movimiento valida el saldo disponible, aplica el límite diario de retiros de $1,000 y persiste el movimiento en una sola transacción (`@Transactional`). Si cualquier validación falla, todo se revierte.

Los errores de negocio se centralizan en `GlobalExceptionHandler` (`@ControllerAdvice`), que convierte las excepciones de dominio (`BusinessException`, `ResourceNotFoundException`) en respuestas JSON con el código HTTP correspondiente.

### Endpoints

| Recurso | Métodos |
|---|---|
| `/api/clientes` | GET, POST, PUT, DELETE |
| `/api/cuentas` | GET, POST, PATCH, DELETE |
| `/api/movimientos` | GET, POST |
| `/api/reportes` | GET (filtro por fechas y cliente) |

### Pruebas

```bash
cd backend && ./mvnw clean test
```

Pruebas unitarias con JUnit 5 y Mockito sobre los tres servicios principales y con MockMvc sobre los controladores.

### Correr sin Docker

```bash
cd backend && ./mvnw spring-boot:run
```

---

## Frontend (`/Frontend`)

Angular 21 con Standalone Components, Reactive Forms y RxJS. Estilos propios con CSS puro (glassmorphism via variables `--css`), sin librerías de componentes externas.

Cada módulo de feature (`clientes`, `cuentas`, `movimientos`, `reportes`) tiene su propio Facade que mantiene el estado con `BehaviorSubject` y centraliza las llamadas a la API. Los componentes solo consumen observables y llaman métodos del Facade, lo que los hace completamente testeables de forma aislada.

El módulo de reportes genera el PDF en el navegador con `jsPDF` porque el backend no expone ese endpoint; el frontend toma el JSON del estado de cuenta y construye la tabla directamente.

Un `HttpInterceptor` intercepta los errores de red y de API antes de que lleguen a los componentes, y los redirige al `ToastService` (implementado con Signals).

### Pruebas

```bash
cd Frontend && npm run test
```

Suite de Jest 30 con `jest-preset-angular`. El TestBed se inicializa con `BrowserDynamicTestingModule` en `setup-jest.ts`. Hay specs para el componente raíz y para el formulario reactivo de clientes (validaciones, flujo de guardado).

### Correr sin Docker

```bash
cd Frontend
npm install --legacy-peer-deps
npm start
```

---

## Base de Datos

H2 en memoria. El esquema se genera automáticamente por Hibernate al arrancar. Los datos iniciales los inserta `BaseDatos.sql`:

- **Jose Lema** → cuentas de ahorro ($2,000) y corriente ($1,000)
- **Marianela Montalvo** → cuenta corriente ($100) y de ahorro ($540)
- **Juan Osorio** → cuenta de ahorro ($0)

El modelo tiene herencia entre `Persona` y `Cliente` con estrategia `JOINED` de JPA.