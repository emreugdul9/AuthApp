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
│       ├── Controllers/
│       ├── Services/
│       ├── Repositories/
│       └── Models/
│   └── AuthApp.Backend.Tests/# Unit & Integration tests
├── AuthApp.Frontend/         # React Router 7 SPA
│   ├── app/
│   ├── routes/
│   └── services/
└── docker-compose.yml        # Docker orchestration
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

## 📊 Monitoring & Metrics

### Backend Metrics
- **Endpoint**: `GET /api/metrics`
- **Serilog**: Console ve file logging
- **Request tracking**: Her istek için timing ve count
- **Middleware**: RequestMetricsMiddleware

### Frontend Logging
- **RequestLogger**: API çağrıları için detaylı log
- **Console output**: Request/response timing
- **Statistics**: Success/fail rates ve avg duration

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

## 📝 Testing

### Docker'da Test Çalıştırma (Önerilen)
```bash
# Windows
run-tests-docker.bat

# Linux/macOS
./run-tests-docker.sh
```

### Yerel Test Çalıştırma
```bash
# Backend testleri
cd AuthApp.Backend
dotnet test

# Frontend testleri
cd AuthApp.Frontend
npm test
```

### Test Environment
- **docker-compose.test.yml**: İzole test ortamı
- **Dockerfile.test**: Test için özel container'lar
- **Cross-platform**: Windows (.bat) ve Linux/macOS (.sh) script'leri
- **Containerized**: Jest PATH sorunları çözüldü
- **Fast**: Paralel test execution
