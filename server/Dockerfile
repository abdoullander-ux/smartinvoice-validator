FROM node:20 AS builder
WORKDIR /app

# Install dependencies (including devDependencies for building)
COPY server/package.json server/package-lock.json* ./
RUN npm install

# Copy source and build
COPY server/ ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built server and production deps
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
