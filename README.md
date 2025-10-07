# 🐼 PandaKey Games

**Plataforma de venta de llaves de videojuegos**

## 🏗️ Arquitectura

- **Full-Stack**: `www.pandakey.games` - Next.js app con API routes
- **Base de datos**: MongoDB Atlas
- **Despliegue**: DigitalOcean App Platform

## 📁 Estructura del proyecto

```
pandakey/
├── src/
│   └── app/
│       ├── api/          # API routes (backend)
│       │   ├── games/    # Games endpoints
│       │   ├── auth/     # Authentication
│       │   └── health/   # Health check
│       ├── globals.css   # Estilos globales
│       ├── layout.tsx    # Layout principal
│       └── page.tsx      # Página de inicio
├── .do/app.yaml         # DigitalOcean config
├── .env.example         # Variables de entorno
├── package.json         # Next.js único
└── README.md
```

## 🚀 Desarrollo local

1. **Clonar repositorio**:
   ```bash
   git clone https://github.com/OskarFate/pandakey.git
   cd pandakey
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus valores
   ```

3. **Instalar dependencias**:
   ```bash
   npm install
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

5. **Acceder a**:
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health
   - API Games: http://localhost:3000/api/games

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `GET /api/games` - Listar juegos
- `GET /api/games/[id]` - Obtener juego por ID
- `POST /api/games` - Crear juego (admin)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

## 🔧 Variables de entorno requeridas

- `MONGODB_URI`: Conexión a MongoDB Atlas
- `JWT_SECRET`: Secreto para JWT tokens
- `NEXTAUTH_SECRET`: Secreto para NextAuth.js
- `NEXTAUTH_URL`: URL de la aplicación

## 🚀 Despliegue en DigitalOcean

El proyecto está optimizado para DigitalOcean App Platform con una sola aplicación Next.js que maneja frontend y backend.

## 📋 Roadmap

- [x] ✅ Infraestructura Next.js simplificada
- [x] ✅ API routes configuradas
- [x] ✅ Configuración DigitalOcean optimizada
- [ ] 🗄️ Integración MongoDB Atlas
- [ ] 🔐 Autenticación completa con NextAuth
- [ ] 🎨 UI completa para la tienda
- [ ] 💳 Sistema de pagos
- [ ] 🚀 Despliegue en producción

---

*Proyecto iniciado el 7 de octubre de 2025*
