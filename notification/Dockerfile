FROM node:18-alpine3.18

WORKDIR /app

COPY . /app

RUN npm ci --only=prod
CMD [ "node", "src/init.js" ]
