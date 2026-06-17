# Stage 1: Build static React files
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build-time environment variables for Vite
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Build the project
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from Stage 1 to Nginx default public directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
