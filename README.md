# Uno% — Gimnasio de barrio

Sitio web para un gimnasio de barrio: landing con información básica (planes,
horarios, contacto) + cuentas de usuario. Pensado para crecer con clases,
ingreso por QR y turnos programados.

## Stack

- **Backend**: NestJS 11 + TypeORM + SQLite (`better-sqlite3`) + JWT (Passport) + `@nestjs/schedule`
- **Frontend**: Angular 21 + Tailwind CSS 4

## Estructura

```
UNOPORCIENTO/
├── backend/     # API REST (NestJS)
└── frontend/    # Sitio web (Angular)
```

## Backend

```bash
cd backend
npm install
cp .env.example .env   # opcional, ya trae defaults de desarrollo
npm run start:dev
```

Levanta en `http://localhost:3000`, con prefijo `/api`. Al arrancar por
primera vez crea el archivo `unoporciento.sqlite` y siembra 3 planes por
defecto (Pase diario, Mensual, Trimestral).

### Endpoints principales

| Método | Ruta                       | Descripción                              | Auth       |
|--------|----------------------------|-------------------------------------------|------------|
| POST   | `/api/auth/register`       | Crear cuenta de socio (nombre, apellido, DNI, fecha de nacimiento, email, teléfono, contraseña) | No |
| POST   | `/api/auth/login`          | Iniciar sesión, devuelve JWT              | No         |
| GET    | `/api/auth/me`             | Datos del usuario logueado                | Sí         |
| GET    | `/api/plans`                | Planes activos (para la landing)         | No         |
| POST   | `/api/plans`                | Crear plan (pensado para admin)          | Sí (admin) |
| POST   | `/api/subscriptions`        | Dar de alta la cuota de un socio a un plan | Sí       |
| GET    | `/api/subscriptions/me`     | Historial de cuotas del socio logueado   | Sí         |
| POST   | `/api/subscriptions/:id/renew` | Registrar el pago y renovar la cuota  | Sí (admin) |
| POST   | `/api/subscriptions/:id/cancel` | Cancelar una cuota                   | Sí (admin) |
| GET    | `/api/subscriptions`        | Listado de cuotas (filtro `?status=`)    | Sí (admin) |
| GET    | `/api/instagram/posts`      | Publicaciones recientes de Instagram      | No         |

### Cuotas y vencimientos (módulo `subscriptions`)

- Al registrar (`subscribe`), se calcula `dueDate = hoy + plan.durationDays` y
  se crea un `Payment` inicial con estado `pending`.
- `renew` registra el pago como `paid` y extiende el vencimiento: si la cuota
  ya venció, cuenta los días desde hoy; si todavía está vigente, los cuenta
  desde el vencimiento actual (no se pierden días pagos).
- Un cron diario (`@nestjs/schedule`, 3 AM) marca como `expired` toda cuota
  `active` cuyo `dueDate` ya pasó.
- Estados de `Subscription`: `active`, `expired`, `cancelled`.
- Estados de `Payment`: `pending`, `paid`.

### Instagram (módulo `instagram`)

Usa la **Instagram Graph API** (la única vía soportada por Meta desde que se
dio de baja la Basic Display API en diciembre 2024). Esto implica:

- La cuenta de Instagram tiene que ser **Business o Creator**, vinculada a
  una página de Facebook (no funciona con cuentas personales).
- Hay que crear una app en Meta for Developers, pasar la revisión de la app
  (puede tardar semanas) y generar un token de larga duración (60 días, se
  renueva).
- Límite de ~200 llamadas/hora por cuenta — por eso el backend cachea la
  respuesta 30 minutos en memoria.

Configurando `INSTAGRAM_ACCESS_TOKEN` y `INSTAGRAM_BUSINESS_ACCOUNT_ID` en
`.env`, el endpoint `/api/instagram/posts` empieza a devolver publicaciones
reales. Sin esas variables, devuelve `{ configured: false, posts: [] }` y el
frontend muestra un aviso en vez de romperse.

## Frontend

```bash
cd frontend
npm install
npm start
```

Levanta en `http://localhost:4200` y consume la API en
`http://localhost:3000/api` (configurado en `src/environments`).

Páginas: `/` (landing con planes, horarios y contacto), `/login`,
`/register`.

## Cómo sigue creciendo

El backend ya está armado para agregar módulos nuevos sin romper lo
existente:

- **Clases programadas**: nuevo módulo `classes` (entidad `Class` +
  relación con `User` para inscripciones).
- **Ingreso con QR**: nuevo módulo `checkins`, generando un código único
  por socio (por ejemplo con `qrcode` en el back) y un endpoint que valide
  el escaneo en portería.
- **Panel de administración**: ya existen `Roles`/`RolesGuard` armados;
  alcanza con marcar usuarios como `admin` y agregar las rutas protegidas
  correspondientes en el frontend (listado de cuotas, renovar/cancelar,
  crear planes).
- **Notificaciones de vencimiento**: el cron de `subscriptions` ya detecta
  cuotas vencidas; se le puede sumar el envío de un mail/WhatsApp en el
  mismo lugar donde hoy solo loguea.
- **Base de datos en producción**: cambiar `type: 'better-sqlite3'` por
  `postgres` en `backend/src/app.module.ts` y pasar a migraciones en vez
  de `synchronize: true`.
