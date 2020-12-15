FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./
# Bundle app source

RUN mkdir www
COPY www/package*.json www/
COPY www/tsconfig.json www/tsconfig.json
COPY www/public www/public
COPY www/src www/src

RUN cd www && yarn install && yarn run build


COPY package*.json .
COPY tsconfig.json .
RUN yarn install

RUN mkdir server
COPY server server

RUN npm install -g typescript ts-node @prisma/cli

RUN mkdir prisma
COPY prisma prisma

RUN prisma generate


#COPY . .
#RUN npm install -g typescript ts-node @prisma/cli
#RUN yarn install
#RUN prisma generate
#RUN cd ./www && yarn install && yarn run build
# If you are building your code for production
# RUN npm ci --only=production



EXPOSE 3000
CMD [ "ts-node", "./server/index.ts" ]