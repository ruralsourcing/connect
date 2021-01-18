FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g typescript nodemon ts-node @prisma/cli

COPY ./package.json .
COPY ./prisma ./prisma
RUN yarn install
RUN prisma generate
COPY ./server ./server
RUN cd server && yarn install

EXPOSE 3000