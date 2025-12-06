FROM node:22-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg curl python3 && \
    npm install -g yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
