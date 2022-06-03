FROM node:13.12.0-alpine
WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm install 
COPY . ./
CMD npm start
EXPOSE 3000