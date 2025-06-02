# 1. Base image for building Angular app
FROM node:22-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Install Angular CLI globally
RUN npm install -g @angular/cli

# 4. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy remaining project files
COPY . .

# 6. Build Angular app (using correct project name)
RUN ng build frontend --configuration production

# 7. Final image: use Nginx to serve the app
FROM nginx:stable-alpine

# 8. Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 9. Copy built Angular app from builder
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# 10. Ensure Nginx has proper permissions
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/run /usr/share/nginx/html

# 11. Expose HTTP port
EXPOSE 80

# 12. Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
