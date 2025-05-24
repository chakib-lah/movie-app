# 1. Base image for build
FROM node:22-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY package*.json ./
RUN npm install

# 4. Copy Angular app and build it
COPY . .
#RUN npm run build
#RUN npm run build -- --output-path=dist/frontend

RUN npm run build --configuration production
RUN ls -R dist/frontend

# 5. Nginx to serve the app
FROM nginx:stable-alpine

# 6. Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 7. Copy built Angular app to Nginx
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# 8. Expose HTTP port
EXPOSE 80

# 9. Start Nginx
CMD ["nginx", "-g", "daemon off;"]
