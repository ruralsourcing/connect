FROM node:latest

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./prisma ./prisma
RUN yarn install
COPY ./www ./www
RUN cd www && yarn install

EXPOSE 3000


#   yarn global add serve
#   serve -s build