FROM node:18.15.0-slim

USER node
WORKDIR /home/node

ADD ./package*.json .

ENV NODE_ENV production

RUN npm ci --omit=dev

ADD ./dist ./dist

CMD [ "node", "./dist/main.js" ]
