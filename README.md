# 🎬 Movie App – Angular + Node.js + MongoDB

A full-stack Movie Library application built with:

- **Angular 19** + Angular Material (frontend)
- **Node.js + Express** (backend)
- **MongoDB** (database)
- **JWT Authentication** with access + refresh tokens
- **Dockerized** for easy development and deployment

---

## 📦 Features

- 🔐 Login / Register with JWT Auth
- 📄 View movie list and details
- ✍️ Add, update, delete movies
- 👤 User dashboard/profile page
- 💥 Error handling, route guards
- ☁️ Docker setup for full environment

---

## 🐳 Docker Setup

This app runs with Docker Compose using 3 services:

| Service   | Tech               | Port                |
|-----------|--------------------|---------------------|
| frontend  | Angular + Nginx    | `http://localhost:4200` |
| backend   | Node.js + Express  | `http://localhost:3000` |
| database  | MongoDB            | Internal (port 27017)   |

### 📁 Folder Structure

```

.
├── backend/                # Express API + auth
├── frontend/               # Angular 19 app
├── Docker/                 # Dockerfiles + nginx config
└── docker-compose.yml      # Main Compose config

```

### 🛠 .env Setup (Backend)

Inside `backend/.env`:

```env
PORT=3000
ACCESS_SECRET=yourAccessSecretKey123
REFRESH_SECRET=yourRefreshSecretKey456
MONGO_URI=mongodb://mongo:27017/movie-app
FRONT_URI=http://localhost:4200
NODE_ENV=production
```

---

## 🚀 Getting Started with Docker

> Make sure Docker Desktop is installed.

### 🔧 Build and Run

```bash
cd Docker
docker compose up --build
```

### 🧪 Verify It's Working

* Frontend: [http://localhost:4200](http://localhost:4200)
* Backend: [http://localhost:3000](http://localhost:3000)

> ✅ Test login, register, and movie features.

### 🔄 Rebuild from scratch

```bash
docker compose down --volumes
docker compose up --build
```

---

## 📂 Dockerfile Summary

### ✅ Frontend (Angular)

* Uses Node to build
* Uses **Nginx** to serve static files
* Output path: `/app/dist/frontend/browser`

### ✅ Backend (Node.js)

* Runs `npm install`
* Starts server with `npm start`
* Connects to Mongo via Docker network

---

## 🔍 Common Docker Commands

| Command                       | Description             |
| ----------------------------- | ----------------------- |
| `docker compose up`           | Start services          |
| `docker compose down`         | Stop services           |
| `docker exec -it backend sh`  | Shell into backend      |
| `docker exec -it frontend sh` | Shell into frontend     |
| `docker ps`                   | List running containers |

---

## 🛑 Stop All

```bash
docker compose down
```

---

## 📌 Notes

* Nginx config is in: `Docker/nginx.conf`
* Refresh token is stored as HTTP-only cookie
* API is protected using JWT middleware
* Angular interceptor handles auto-refresh on 401

---

