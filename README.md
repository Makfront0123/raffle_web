# Raffles Web - Plataforma de Rifas Online

**Raffles Web** es una plataforma profesional para crear, gestionar y participar en rifas en línea.  
Incluye un **frontend para usuarios** y un **dashboard de administración** con analíticas, gestión de rifas, premios y pagos.

---

## 🛠 Tecnologías usadas

- **Frontend:** Next.js + TypeScript
- **Backend:** Node.js + TypeScript
- **Base de datos:** MySQL + TypeORM
- **Autenticación:** Google OAuth
- **Pagos:** Wompi
- **Mensajería:** Twilio (WhatsApp)
- **Dashboard:** Recharts para estadísticas
- **Testing:** Jest

---

## ✨ Características principales

### Usuario

- Registro e inicio de sesión con Google
- Explorar rifas disponibles
- Reservar y comprar tickets con Wompi
- Recepción de recibo por WhatsApp
- Validación de tickets ganadores (no puede ganar más de una vez por rifa)

### Admin

- Dashboard con estadísticas: rifas activas, pendientes y finalizadas, dinero generado, ganadores
- CRUD para rifas, premios y proveedores
- Gestión de pagos de usuarios y exportación a Excel
- Activar rifas, regenerar tickets
- Cron jobs automáticos para rifas expiradas
- Borrado en cascada seguro

---

## ⚡ Instalación

1. Acceder a client y server:

```bash
cd web_rifa
cd client
pnpm run dev

cd server
pnpm run dev

## CREDENCIALES ADMIN

email: limited_admin@test.com
password: 12312312
```

## Testing

pnpm test

1. Acceder a <https://raffle-web-seven.vercel.app> para ver el frontend
2. Acceder a <https://raffle-web-seven.vercel.app/rw_admin> para ver el dashboard

## 🎬 Demo del proyecto

Para ver el demo funcional de la plataforma de rifas, visita el siguiente video:
<https://youtu.be/uWFRt49Uz7Y>

## Opcional: Ejecutar con Docker (recomendado)

Requisitos:

- Docker
- Docker Compose

web_rifa/
├── client/
    └── .env.client
    └── Dockerfile
├── server/
    └── .env.server
    └── Dockerfile
├── docker/
│   └── mysql/
│       └── init.sql
├── docker-compose.yml
└── README.md

### Variables de entorno para Docker

#### Backend (`server/.env.server`)

- `DB_HOST` → Host de la base de datos (ej: `mysql`)
- `DB_PORT` → Puerto de MySQL (default: 3306)
- `DB_USER` → Usuario de MySQL
- `DB_PASSWORD` → Contraseña de MySQL
- `DB_DATABASE` → Nombre de la base de datos
- `NODE_ENV` → Modo de ejecución (default: `development`)
- `PORT` → Puerto de ejecución (default: `4000`)
- `JWT_SECRET` → Secreto para JWT
- `JWT_REFRESH_SECRET` → Secreto para JWT de refresco
- `WOMPI_PRIVATE_KEY` → Key privada para pagos Wompi
- `WOMPI_INTEGRITY_SECRET` → Secreto de integridad para pagos Wompi
- `WOMPI_PUBLIC_KEY` → Clave pública de Wompi
- `TWILIO_ACCOUNT_SID` → ID de cuenta de Twilio
- `TWILIO_AUTH_TOKEN` → Token de autenticación de Twilio
- `ADMIN_SETUP_KEY` → Clave de configuración para administradores
- `CRON_SECRET` → Secreto para cron

#### Frontend (`client/.env.client`)

- `NEXT_PUBLIC_BACKEND_URL` → URL del backend (ej: `http://localhost:4000`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → ID de OAuth para Google
- `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` → Key pública de Wompi

### Ejecutar con Docker

1. Construir y levantar los servicios:

```bash
docker compose up --build
