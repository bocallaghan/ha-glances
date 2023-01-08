from node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8125
CMD [ "node", "glances-api-server.js" ]