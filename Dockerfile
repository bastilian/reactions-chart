FROM nodesource/jessie:5.9.1

RUN apt-get update
RUN apt-get install -y libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++

RUN mkdir /app
COPY package.json /app
WORKDIR /app

RUN npm install

EXPOSE 3000

CMD npm start
