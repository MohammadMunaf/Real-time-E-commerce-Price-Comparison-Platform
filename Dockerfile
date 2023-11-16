
The error you're encountering is likely due to permission issues when running the npm i command inside the Docker container. To resolve this, you can follow the best practice of using a non-root user in your Dockerfile. Here's an updated version of your Dockerfile:

Dockerfile
Copy code
FROM ghcr.io/puppeteer/puppeteer:21.0.2

# Create a non-root user
RUN useradd -m -d /home/nodeuser -s /bin/bash nodeuser

# Set the working directory and permissions
WORKDIR /usr/src/app
RUN chown -R nodeuser:nodeuser /usr/src/app

# Switch to the non-root user
USER nodeuser

# Environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Specify the command to run your application
CMD ["node", "index.js"]