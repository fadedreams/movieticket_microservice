# Use the official Node.js Alpine image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies using pnpm
COPY package.json .
RUN npm install -g pnpm && \
    pnpm install --only=prod

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Specify the command to run your application
CMD ["pnpm", "run", "dev"]

