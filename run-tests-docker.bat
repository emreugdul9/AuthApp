@echo off
echo 🚀 Running AuthApp Tests in Docker
echo ==================================

echo 📋 Running Backend Tests...
docker-compose -f docker-compose.test.yml build backend-test
docker-compose -f docker-compose.test.yml run --rm backend-test

echo 🎨 Running Frontend Tests...
docker-compose -f docker-compose.test.yml build frontend-test
docker-compose -f docker-compose.test.yml run --rm frontend-test

echo 🧹 Cleaning up...
docker-compose -f docker-compose.test.yml down --remove-orphans

echo ✅ All tests completed!
pause
