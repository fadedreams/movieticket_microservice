FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies using pnpm
COPY package.json .
RUN npm install -g pnpm && \
    pnpm install

# Copy the rest of the application code
COPY . .

# Specify the command to run your application
CMD ["pnpm", "start"]

