# ============================================================================
# Dockerfile - BEGENONE Monolith Application
# ============================================================================
# Operational Role:
#   Builds a production-ready container image for the BEGENONE Node.js
#   monolith backend using Node 20 on Alpine Linux for minimal image size.
#
# Deployment Assumptions:
#   - Environment variables (DATABASE, JWT_SECRET, etc.) are injected at
#     runtime via Docker Compose, Kubernetes ConfigMaps, or orchestrator env.
#   - The container listens on port 80; a reverse proxy or load balancer
#     should handle TLS termination externally.
#   - npm start invokes the production entry point (server.js).
#
# Security Implications:
#   - No application secrets are baked into the image.
#   - Alpine base reduces attack surface compared to full Debian images.
#   - Dependencies are installed before copying source to leverage Docker
#     layer caching and reduce rebuild times.
# ============================================================================

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
