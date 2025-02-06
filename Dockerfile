
FROM node:18.18-slim

RUN apt-get update -y
RUN apt-get install -y openssl

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install

COPY . .

RUN npm install -g prisma
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
