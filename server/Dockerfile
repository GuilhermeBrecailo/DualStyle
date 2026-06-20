FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

EXPOSE 8081
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
