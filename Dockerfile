#Build stage
FROM node:20-alpine as build

WORKDIR /src/

COPY package*.json /src/

RUN npm install

COPY . .

#RUN npm run build

#Dev stage
FROM node:20-alpine AS dev

WORKDIR /src/

COPY --from=build /src/node_modules node_modules

USER node

CMD npm run hotreload