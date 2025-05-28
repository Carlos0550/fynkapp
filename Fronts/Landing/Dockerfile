FROM node:18.20.8

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 4321

CMD ["npm", "run", "preview"]
