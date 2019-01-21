FROM node:11

WORKDIR /web

COPY . /web/

RUN npm install
RUN npm run build:prod

EXPOSE 3000

WORKDIR /web/dist

CMD [ "node", "index.js" ]
