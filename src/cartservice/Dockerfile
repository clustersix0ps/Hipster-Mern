FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 7070

CMD [ "npm", "start" ]

