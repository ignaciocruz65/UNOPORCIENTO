# Uno% — Gimnasio de barrio

Sitio web para un gimnasio de barrio: landing con información básica (planes,
horarios, contacto) + cuentas de usuario. Pensado para crecer con clases,
ingreso por QR y turnos programados.

## Stack

- **Backend**: NestJS 11 + TypeORM + SQLite (`better-sqlite3`) + JWT (Passport)
- **Frontend**: Angular 21 (standalone, SSR) + Tailwind CSS 4

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

| Método | Ruta               | Descripción                       | Auth |
|--------|--------------------|------------------------------------|------|
| POST   | `/api/auth/register` | Crear cuenta de socio            | No   |
| POST   | `/api/auth/login`    | Iniciar sesión, devuelve JWT     | No   |
| GET    | `/api/auth/me`       | Datos del usuario logueado       | Sí   |
| GET    | `/api/plans`         | Planes activos (para la landing) | No   |
| POST   | `/api/plans`         | Crear plan (pensado para admin)  | Sí (admin) |

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
  correspondientes en el frontend.
- **Base de datos en producción**: cambiar `type: 'better-sqlite3'` por
  `postgres` en `backend/src/app.module.ts` y pasar a migraciones en vez
  de `synchronize: true`.
