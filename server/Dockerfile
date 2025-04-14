FROM node:20

WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (incluye devDependencies)
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar el proyecto
RUN npm run build

# Exponer el puerto (opcional pero recomendado en Railway)
EXPOSE 5000

# Ejecutar el backend compilado
CMD ["node", "dist/index.js"]
