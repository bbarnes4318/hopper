FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy built files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000

CMD ["sh", "-c", "next start -p ${PORT:-3000} -H 0.0.0.0"]

