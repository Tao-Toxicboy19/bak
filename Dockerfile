FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript (if needed)
RUN npx tsc

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 7070

# Start the application with PM2
CMD ["node", "dist/main.js"]

