# Etapa 1: Construcción (Multi-stage build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias e instalar forzando la compatibilidad de peer dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto del código y compilar para producción
COPY . .
# Usamos export NG_CLI_ANALYTICS=false para que no pregunte por telemetría
RUN export NG_CLI_ANALYTICS=false && npm run build --configuration=production

# Etapa 2: Servidor de Producción con Nginx
FROM nginx:alpine

# Limpiar Nginx por defecto y copiar configuración personalizada
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los artefactos del build de Angular
# Nota: Si falla aquí, ajusta la ruta dist/Frontend/browser a dist/Frontend dependiendo del output
COPY --from=builder /app/dist/Frontend/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
