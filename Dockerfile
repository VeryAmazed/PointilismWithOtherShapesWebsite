FROM node:14
WORKDIR /all
COPY package*.json ./
RUN npm install

COPY . .
RUN g++ -std=c++17 -o ./manip.out ./manip.cpp
EXPOSE 8080
CMD ["node", "app.js"]