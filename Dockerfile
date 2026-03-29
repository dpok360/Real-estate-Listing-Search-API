# Use the official Node.js 20 image
FROM node:20-slim

LABEL maintainer="deepak.suyavanshi.360@gmail.com"

# Install system dependencies including OpenSSL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@latest
RUN npm install --legacy-peer-deps --build-from-source

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Set the default command to run the application
CMD ["npm", "run", "start"]
