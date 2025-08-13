# Backend Development Environment

Bu docker-compose.yml dosyası **sadece backend development** için kullanılır.

## 🎯 Kullanım Alanları

### 1. **Backend Geliştirme**
```bash
cd AuthApp.Backend/AuthApp.Backend
docker-compose up -d
```
- Sadece backend + database çalışır
- Frontend'i ayrı olarak `npm run dev` ile çalıştırabilirsiniz

### 2. **Database Testing**
```bash
# Sadece database'i ayağa kaldır
docker-compose up -d postgres
```

### 3. **Backend Unit/Integration Tests**
- Test environment için isolated database

## ⚙️ Konfigürasyon

- **Database**: PostgreSQL 16
- **Port**: 5000 (backend), 5432 (postgres)  
- **Environment**: Development
- **JWT**: Development keys
- **CORS**: localhost:3000 enabled

## 🔄 Production vs Development

| Aspect | Development (Bu dosya) | Production (Ana docker-compose) |
|--------|----------------------|--------------------------------|
| Database User | postgres/postgres | authuser/authpass |
| Container Names | *_dev suffix | Production names |
| JWT Keys | Development keys | Production keys |
| Environment | Development | Production |

## 📝 Notlar

- Production deployment için **ana klasördeki docker-compose.yml** kullanın
- Bu dosya sadece backend development workflow'u için optimize edilmiştir
- Health checks ve dependency management eklendi
