# 1. Use the official Node.js image as a base
FROM node:20-alpine

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the source code into the container
COPY . .

# 5. Expose the port your app runs on
EXPOSE 3000

# 6. Set environment variables (can also be used in docker-compose)
ENV NODE_ENV=production

# 7. Start the server
CMD ["npm", "start"]
