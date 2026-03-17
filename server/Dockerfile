FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files (from server/ directory)
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server.js (from server/ directory relative to build context)
COPY server/server.js ./

# Copy static files from parent directory
COPY index.html ./
COPY assets ./assets
COPY favicon.png ./
COPY .nojekyll ./

# Create data directory
RUN mkdir -p /app/data

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]