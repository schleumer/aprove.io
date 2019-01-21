FROM node:11 as build-stage

WORKDIR /app

COPY ./ /app/

RUN npm install
RUN npm run build

######################

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/build /usr/share/nginx/html
