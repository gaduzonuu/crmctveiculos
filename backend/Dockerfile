# ── Backend Dockerfile ──────────────────────────────────────────
# Uses Node 20 LTS slim image for minimal attack surface
FROM node:20-slim

WORKDIR /app

# Copy dependency manifests first (better layer cache)
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

EXPOSE 3000

# Use 'npm start' which calls 'node src/index.js'
CMD ["npm", "start"]
