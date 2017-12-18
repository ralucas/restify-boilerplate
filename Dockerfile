FROM node:latest

RUN apt-get -y update

ENV HOME /api
WORKDIR ${HOME}
ADD . $HOME

COPY ./npmrc ${HOME}/.npmrc

# install pm2 and npm packages
RUN npm install -g pm2 && npm install -g nodemon && npm install -g node-gyp && npm install

COPY entrypoint.sh /entrypoint
RUN chmod +x /entrypoint

ENTRYPOINT ["/entrypoint", "pm2-docker", "bin/server"]

#CMD ["npm", "start"]