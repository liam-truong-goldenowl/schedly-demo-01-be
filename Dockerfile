# ---------- Build Stage ----------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build


# ---------- Production Stage ----------
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only the built output and necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose app port
EXPOSE 3000

# Run the app
CMD ["node", "dist/src/main"]
