# 🐼 PandaKey Games

**Plataforma de venta de llaves de videojuegos**

## 🏗️ Arquitectura

- **Frontend**: `www.pandakey.games` - Next.js tienda
- **Backend**: `api.pandakey.games` - Node.js/Express API
- **Base de datos**: MongoDB Atlas
- **Despliegue**: DigitalOcean App Platform

## 📁 Estructura del proyecto

```
pandakey/
├── frontend/          # Next.js store (www.pandakey.games)
├── backend/           # Node.js API (api.pandakey.games)
├── .do/              # DigitalOcean App Platform config
├── .env.example      # Environment variables template
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
   cp .env.example .env
   # Editar .env con tus valores
   ```

3. **Instalar dependencias**:
   ```bash
   npm run setup
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

5. **Acceder a**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 🌐 Despliegue en DigitalOcean

El proyecto está configurado para desplegarse automáticamente en DigitalOcean App Platform:

- **Tienda**: www.pandakey.games
- **API**: api.pandakey.games

### Variables de entorno requeridas:
- `MONGODB_URI`: Conexión a MongoDB Atlas
- `JWT_SECRET`: Secreto para JWT tokens
- `NEXTAUTH_SECRET`: Secreto para NextAuth.js

## 📋 Roadmap

- [x] ✅ Infraestructura inicial
- [x] ✅ Frontend Next.js configurado
- [x] ✅ Backend Node.js/Express
- [x] ✅ Configuración DigitalOcean
- [ ] 🗄️ Modelos de base de datos
- [ ] 🔐 Autenticación completa
- [ ] � Sistema de pagos
- [ ] 🚀 Despliegue en producción

---

*Proyecto iniciado el 7 de octubre de 2025*