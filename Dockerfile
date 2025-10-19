# Use Node 20 Alpine for smaller image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with flags to handle deprecated packages
RUN npm install --legacy-peer-deps --force && \
    npm cache clean --force

# Copy all source files
COPY . .

# Build the production app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]