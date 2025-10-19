FROM node:20-alpine


WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --force && \
    npm cache clean --force

# Copy source files
COPY . .

# Set memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=1536"

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve


EXPOSE 3000


CMD ["serve", "-s", "dist", "-l", "3000"]