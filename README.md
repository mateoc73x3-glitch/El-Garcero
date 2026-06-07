# EL GARCERO - Plataforma Web Full Stack

Aplicacion full-stack con NestJS + MongoDB + React/Vite + Tailwind para una experiencia premium tropical moderna.

## 1) Instalacion

### Backend
1. `cd backend`
2. `cp .env.example .env`
3. `npm install`
4. `npm run start:dev`

### Frontend
1. `cd frontend`
2. `cp .env.example .env`
3. `npm install`
4. `npm run dev`

## 2) Arquitectura

- Backend: `src/modules`, `src/common`, `src/config`
- Frontend: `src/store`, `src/services`, `src/types`
- Tema visual oficial:
  - `#084838` primary
  - `#E68A00` secondary
  - `#F5D765` accent
  - `#F4EFE2` cream
  - `#FAF8F3` background

## 3) Endpoints REST

- `GET/POST/PATCH/DELETE /api/categories`
- `GET/POST/PATCH/DELETE /api/dishes`
- `GET/POST/PATCH/DELETE /api/reservations`
- `GET/POST/PATCH/DELETE /api/orders`
- `GET/POST/PATCH/DELETE /api/users`
- `GET/POST/DELETE /api/favorites`
- `POST /api/auth/login`

## 4) Produccion

- Habilitar secretos reales (`JWT_SECRET`) y CORS restringido.
- Activar helmet, rate limiting y logs estructurados.
- Mover assets a CDN y usar cache HTTP.
- Desplegar backend con PM2 o contenedor Docker.

## 5) Escalabilidad

- Agregar Redis para sesiones/cache.
- Implementar colas para pedidos (BullMQ).
- Agregar testing E2E con datos seed.
- Dividir frontend por features y code-splitting por rutas.
