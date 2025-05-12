FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app/src/socket-server

EXPOSE 3001
CMD ["node", "index.js"]