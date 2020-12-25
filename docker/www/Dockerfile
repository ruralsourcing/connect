FROM node:latest

WORKDIR /usr/src/app

COPY ./www .
RUN yarn install

EXPOSE 3000
CMD [ "yarn", "run", "start" ]

#   yarn global add serve
#   serve -s build