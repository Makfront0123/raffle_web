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
- Cron jobs automáticos para rifas expiradas y reservas expiradas
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

email: admin@test.com
password: 1234567890
```

## Testing

pnpm test

1. Acceder a <https://raffle-web-seven.vercel.app> para ver el frontend
2. Acceder a <https://raffle-web-seven.vercel.app/rw_admin> para ver el dashboard

## 🎬 Demo del proyecto

Para ver el demo funcional de la plataforma de rifas, visita el siguiente video:
<https://youtu.be/uWFRt49Uz7Y>
