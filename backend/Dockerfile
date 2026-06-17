FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the remaining backend source code
COPY . .

# Expose the port the API gateway runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
