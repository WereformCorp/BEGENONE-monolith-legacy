# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Specify development environment by default (override in production)

# Expose the port the app runs on
EXPOSE 80

# Command to run the app
CMD ["npm", "start"]
# Default production command

# Development command, overridden in docker-compose.yml
# npm run dev
