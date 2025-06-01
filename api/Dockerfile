# Use official Node.js LTS image
FROM node:24-alpine3.21

# Set working directory
WORKDIR /app

COPY . .

# Install dependencies
RUN npm install

# Build TypeScript to JS
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
