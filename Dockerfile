FROM node:20 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
