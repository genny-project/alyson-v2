FROM nginx:1.11.3
RUN apt-get -y update
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash
RUN apt-get install -y nodejs
RUN apt-get install -y git
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10
ADD ./package.json ./package.json
ADD ./ ./
RUN npm install && npm run build-prod
RUN cp -R ./build/*  /usr/share/nginx/html
RUN echo "{\"hash\":$(git rev-parse --short HEAD),\"time\":$(date +%Y-%m-%dT%H:%M:%S)}" >>  /usr/share/nginx/html/version
COPY ./docker-entrypoint.sh  /var/cache/nginx/
ENTRYPOINT [ "/var/cache/nginx/docker-entrypoint.sh" ]