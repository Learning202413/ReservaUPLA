# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["ReservaUPLA.Domain/ReservaUPLA.Domain.csproj", "ReservaUPLA.Domain/"]
COPY ["ReservaUPLA.Application/ReservaUPLA.Application.csproj", "ReservaUPLA.Application/"]
COPY ["ReservaUPLA.Infrastructure/ReservaUPLA.Infrastructure.csproj", "ReservaUPLA.Infrastructure/"]
COPY ["ReservaUPLA.API/ReservaUPLA.API.csproj", "ReservaUPLA.API/"]

RUN dotnet restore "ReservaUPLA.API/ReservaUPLA.API.csproj"

COPY . .
WORKDIR "/src/ReservaUPLA.API"
RUN dotnet publish "ReservaUPLA.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 5060
ENV ASPNETCORE_URLS=http://+:5060
ENV ASPNETCORE_ENVIRONMENT=Production
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ReservaUPLA.API.dll"]
