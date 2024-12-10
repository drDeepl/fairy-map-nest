
FROM node:18.18-slim


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install

COPY . .

RUN npm install -g prisma
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
