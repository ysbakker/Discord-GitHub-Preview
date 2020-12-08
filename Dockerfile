FROM node:latest

LABEL maintainer="Yorrick Bakker"
ENV NODE_ENV=production
USER node

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY --chown=node:node . .

ENV DEBUG=log

ENTRYPOINT [ "node", "index.js" ]