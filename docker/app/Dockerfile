FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./
# Bundle app source
COPY . .
RUN npm install -g typescript ts-node @prisma/cli
RUN yarn install
RUN prisma generate
RUN cd ./www && yarn install && yarn run build
# If you are building your code for production
# RUN npm ci --only=production



EXPOSE 3000
CMD [ "ts-node", "./index.ts" ]