# Usa una imagen base de Node.js
FROM node:14

# Crea un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente del servidor
COPY server.js .

# Expone el puerto en el que el servidor estará escuchando
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "node", "server.js" ]