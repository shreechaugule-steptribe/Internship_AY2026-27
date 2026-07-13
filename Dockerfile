# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend dependencies and install
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Node Backend & Serve Frontend
FROM node:20-alpine
WORKDIR /app/backend

# Copy backend dependencies and install
COPY backend/package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy backend source code
COPY backend/ ./

# Copy built frontend static files from Stage 1 into backend's public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
