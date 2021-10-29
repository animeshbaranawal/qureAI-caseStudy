# pull the official base image
FROM node:alpine
# set working direction
WORKDIR /app
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
# add app
COPY ./ ./
RUN npm i
# start app
CMD ["npm", "run", "start"]
