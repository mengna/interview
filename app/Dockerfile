FROM node:8.9.4-alpine

ADD . /usr/src/app
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000


CMD [ "npm", "start" ]