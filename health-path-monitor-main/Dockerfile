# Frontend Dockerfile - React/Vite
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Remove backend folder from frontend image (it has its own)
RUN rm -rf backend

# Expose Vite dev port
EXPOSE 8080

# Run Vite dev server (accessible from outside container)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
