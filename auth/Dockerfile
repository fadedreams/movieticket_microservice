FROM node:alpine 

# Set working directory
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]

