# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY . .

# Instalar dependências e compilar
RUN npm install
RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copiar só arquivos necessários da build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expor porta
EXPOSE 3000

# Rodar app
CMD ["node", "dist/main"]
