FROM node:7.7

RUN npm install -g nodemon
WORKDIR /code





RUN npm install && npm ls
RUN mv /code/node_modules /node_modules
COPY . /code

