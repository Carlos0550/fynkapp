FROM node:20

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar TODO (incluyendo devDependencies como TypeScript)
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 5000

# Ejecutar backend compilado
CMD ["node", "dist/index.js"]
