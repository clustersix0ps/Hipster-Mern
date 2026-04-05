# Use Node.js as base image (builder stage is not necessary for pure JS, but using a slim image is good)
FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose the API port
EXPOSE 3550

# Run the app
CMD [ "npm", "start" ]
