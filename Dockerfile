
FROM node:16-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install

COPY . .

RUN npm install -g prisma
RUN npx prisma generate

COPY .env .env

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
