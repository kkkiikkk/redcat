FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

COPY .env .env ./

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
