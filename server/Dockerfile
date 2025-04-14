FROM node:20

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código (incluyendo tsconfig y src)
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Usar el build compilado
CMD ["node", "dist/index.js"]
