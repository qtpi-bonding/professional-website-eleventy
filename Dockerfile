# Multi-stage Dockerfile for Eleventy development and production

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Install dependencies for development
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose development port
EXPOSE 8080

# Default command for development
CMD ["npm", "run", "serve"]

# Production build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production serving stage
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/_site /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose production port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]