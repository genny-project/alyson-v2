FROM nginx:1.11.3
RUN apt-get -y update
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get install -y nodejs
RUN apt-get install -y git
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10
ADD ./package.json ./package.json
RUN npm install
ADD ./ ./
RUN npm run build-prod
RUN cp -R ./build/*  /usr/share/nginx/html
COPY ./docker-entrypoint.sh  /var/cache/nginx/
ENTRYPOINT [ "/var/cache/nginx/docker-entrypoint.sh" ]
