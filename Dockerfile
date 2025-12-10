# Multi-stage Dockerfile for Next.js application

### Builder stage
FROM node:20 AS builder
WORKDIR /app

# Allow passing API key at build time to be available at build-time if needed
ARG API_KEY
ENV API_KEY=${API_KEY}

# Install dependencies and build the Next app (includes Tailwind build)
COPY package.json package-lock.json* ./
RUN npm install

# Copy everything and build
COPY . .
RUN npm run build


### Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to run the built app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["npm", "start"]
