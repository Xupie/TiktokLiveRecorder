ARG NODE_VERSION=22.11.0

# BASE
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# BUILD
FROM base as build
RUN npm run build

# PRODUCTION
FROM base as prod
CMD ["node", "build/main.js"]

# Run as non root user
USER node