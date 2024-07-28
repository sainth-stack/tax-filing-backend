# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Install serve globally to serve the build
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 4500

# Start the app on port 4500
CMD ["serve", "-s", "build", "-l", "4500"]
