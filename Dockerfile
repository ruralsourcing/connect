FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g typescript ts-node @prisma/cli

COPY . .
RUN cd www && yarn install && yarn run build
RUN cd server && yarn install

EXPOSE 3000
CMD [ "ts-node", "./server/index.ts" ]