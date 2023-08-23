FROM node:18-alpine

ENV NODE_OPTIONS=--openssl-legacy-provider 

RUN mkdir -p /app
WORKDIR /app

COPY tsconfig.json /app
COPY package.json /app
COPY yarn.lock /app
COPY . /app

RUN yarn install

RUN mkdir -p /app/node_modules/.cache; touch /app/node_modules/.cache/.eslintcache; \
    chown node:node /app/node_modules/.cache /app/node_modules/.cache/.eslintcache

USER node

CMD ["yarn", "start"]