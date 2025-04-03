# Use Node.js official image as a base image
FROM node:alpine

# Set the working directory inside the container to /app
WORKDIR /app

COPY ./package*.json ./


# Install dependencies
RUN npm config set strict-ssl false \
    && npm config set https-proxy "http://rb-proxy-unix-de01.bosch.com:8080" \
    && npm config set proxy "http://rb-proxy-unix-de01.bosch.com:8080" \
    && npm config set registry "http://registry.npmjs.org/" \
    && npm install --silent

# Copy the entire backend code to the container
COPY . ./

# Expose the port your app will run on
EXPOSE 5000

# Start the backend app
CMD ["node", "index.js"]
