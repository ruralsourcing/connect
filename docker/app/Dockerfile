FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g typescript nodemon ts-node @prisma/cli

COPY ./server .
RUN yarn install

RUN prisma generate

EXPOSE 3000
CMD [ "ts-node", "./server/index.ts" ]