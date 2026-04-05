FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5050

CMD [ "npm", "start" ]
