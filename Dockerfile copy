# Base image for Node.js
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies with legacy-peer-deps
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application and build it
COPY . .
RUN npm run build

# Use a lightweight image for serving the built site
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy the build output and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the Next.js port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
