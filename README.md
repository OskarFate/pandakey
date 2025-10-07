# 🐼 PandaKey Games

**Plataforma de venta de llaves de videojuegos**

## 🏗️ Arquitectura

- **Frontend**: `www.pandakey.games` - Next.js tienda (Docker)
- **Backend**: `api.pandakey.games` - Node.js/Express API
- **Base de datos**: MongoDB Atlas
- **Despliegue**: GitHub Actions (gratuito)

## 📁 Estructura del proyecto

```
pandakey/
├── frontend/          # Next.js store (www.pandakey.games)
├── backend/           # Node.js API (api.pandakey.games)
├── .github/workflows/ # CI/CD con GitHub Actions
├── docker-compose.yml # Orquestación local
└── README.md
```

## 🚀 Desarrollo local

1. **Clonar repositorio**:
   ```bash
   git clone https://github.com/tuusuario/pandakey.git
   cd pandakey
   ```

2. **Ejecutar con Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Acceder a**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🌐 Dominios en producción

- **Tienda**: www.pandakey.games
- **API**: api.pandakey.games

## 📋 Roadmap

- [x] ✅ Infraestructura inicial
- [ ] 🔧 Configuración Docker
- [ ] 🎨 Frontend Next.js
- [ ] ⚡ Backend API
- [ ] 🗄️ MongoDB Atlas
- [ ] 🚀 GitHub Actions CI/CD

---

*Proyecto iniciado el 7 de octubre de 2025*