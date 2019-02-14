FROM node:8

# create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# building app for production
# npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080

# start the server
CMD ["npm", "start"]

