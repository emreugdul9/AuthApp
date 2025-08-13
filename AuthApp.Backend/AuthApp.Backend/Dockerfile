FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["AuthApp.Backend.csproj", "./"]
RUN dotnet restore "./AuthApp.Backend.csproj"

COPY . .
RUN dotnet build "AuthApp.Backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AuthApp.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "AuthApp.Backend.dll"]
