# 1. Base image
FROM node:22-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy source code
COPY . .

# 5. Compile TypeScript to JavaScript
RUN npm run build

# 6. Expose backend port
EXPOSE 3000

# 7. Set environment
ENV NODE_ENV=production

# 8. Start app
CMD ["node", "dist/app.js"]
