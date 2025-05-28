FROM node:18.20.8

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

ENV NODE_ENV production

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "${PORT}"]
