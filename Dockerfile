# Use the Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:21.0.2

# Create a non-root user
RUN useradd -m -d /home/nodeuser -s /bin/bash nodeuser

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Switch to the non-root user
USER nodeuser

# Environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Specify the command to run your application
CMD ["node", "index.js"]