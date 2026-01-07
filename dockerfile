# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
