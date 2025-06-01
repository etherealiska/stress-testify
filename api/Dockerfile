# Use official Node.js LTS image
FROM node:24-alpine3.21

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Build TypeScript to JS
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
