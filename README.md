# AuthApp - Full Stack Authentication Application

A modern full-stack authentication application built with .NET 8 Web API backend and React Router 7 frontend.

## 🚀 Quick Start

```bash
docker compose up -d

docker compose ps

docker compose logs -f
```

## 📁 Project Structure

```
AuthApp/
├── AuthApp.Backend/          # .NET 8 Web API
│   ├── AuthApp.Backend/      # Main API project  
│   └── AuthApp.Backend.Tests/# Unit & Integration tests
├── AuthApp.Frontend/         # React Router 7 SPA
└── docker-compose.yml        # Docker orchestration
```
```
AuthApp/
├── docker-compose.yml          # Ana orchestration dosyası
├── AuthApp.Backend/           # .NET 8 Web API
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   └── Models/
├── AuthApp.Frontend/          # React Router 7 SPA
│   ├── app/
│   ├── routes/
│   └── services/
└── README.md
```

## 🌐 Erişim URL'leri

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## 🛠️ Geliştirme

### Backend Geliştirme
```bash
cd AuthApp.Backend/AuthApp.Backend
dotnet run
```

### Frontend Geliştirme
```bash
cd AuthApp.Frontend
npm run dev
```

## 📊 Servisler

| Servis   | Port | Açıklama |
|----------|------|----------|
| Frontend | 3000 | React Router 7 SPA |
| Backend  | 5000 | .NET 8 Web API |
| Database | 5432 | PostgreSQL 15 |

## 🔧 Yapılandırma

- JWT Authentication
- CORS enabled
- Auto-migration on startup
- Health checks
- Restart policies

## 📝 Test

```bash
# Backend testleri
cd AuthApp.Backend
dotnet test

# Frontend testleri
cd AuthApp.Frontend
npm test
```
