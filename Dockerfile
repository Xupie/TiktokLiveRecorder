ARG NODE_VERSION=22.11.0

# BASE
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Create logs and set permissions while root
RUN mkdir -p /usr/src/app/logs && \
    chmod -R 755 /usr/src/app/logs && \
    chown -R node:node /usr/src/app/logs

RUN mkdir -p /usr/src/app/recordings && \
    chmod -R 755 /usr/src/app/recordings && \
    chown -R node:node /usr/src/app/recordings 

RUN chown -R 1000:1000 /usr/src/app/recordings /usr/src/app/logs

USER node

# BUILD
FROM base as build
RUN npm run build

# PRODUCTION
FROM base as prod
CMD ["node", "build/main.js"]