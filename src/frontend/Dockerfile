FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Build React client
WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Final Stage: Serve statically using lightweight Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled React app from builder
COPY --from=builder /usr/src/app/client/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
