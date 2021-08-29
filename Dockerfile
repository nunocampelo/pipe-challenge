FROM node:10.13.0-alpine

# Env
# ENV TIME_ZONE=Asia/Hong_Kong
# ENV ENV_NAME dev
# ENV EGG_SERVER_ENV dev
# ENV NODE_ENV dev
# ENV NODE_CONFIG_ENV dev
# Set the timezone in docker

# Create Directory for the Container
WORKDIR /usr/src/service

# COPY package*.json ./
# Install all Packages
# RUN npm install
# COPY dist ./

# Copy all source code to work directory
ADD . /usr/src/service

RUN npm install
RUN npm run build

CMD ["npm", "start"]