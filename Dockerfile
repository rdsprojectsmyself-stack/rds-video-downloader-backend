FROM node:18-bookworm

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
        ffmpeg \
        curl \
        python3 \
        python3-pip \
    && pip3 install --no-cache-dir yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Optional: verify installations
RUN ffmpeg -version && yt-dlp --version && node -v && npm -v

# Set working directory
WORKDIR /app

# Copy package files (if you have Node app)
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port (change if needed)
EXPOSE 3000

# Start app
CMD ["npm", "start"]
