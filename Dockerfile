FROM nginx:1.11.3
RUN apt-get -y update
RUN apt-get -y install curl
RUN apt-get install -y python-software-properties
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get -y install nodejs
RUN apt-get install -y git
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10
ADD ./package.json ./package.json
RUN npm install semver -g
RUN npm install npmlog -g
RUN npm install update-notifier -g
RUN npm install graceful-fs -g
RUN npm install config-chain -g
RUN npm install inherits -g
RUN npm install nopt -g
RUN npm install osenv -g
RUN npm install umask -g
RUN npm install has-unicode -g
RUN npm install once -g
RUN npm install ini -g
RUN npm install mkdirp -g
RUN npm install uid-number -g
RUN npm install which -g
RUN npm install glob -g
RUN npm install lazy-property -g
RUN npm install uuid -g
RUN npm install slide -g
RUN npm install write-file-atomic -g
RUN npm install validate-npm-package-name -g
RUN npm install read-package-json -g
RUN npm install read-package-tree -g
RUN npm install archy  -g
RUN npm install iferr  -g
RUN npm install lockfile  -g
RUN npm install chownr  -g
RUN npm install dezalgo  -g
RUN npm install inflight  -g
RUN npm install bluebird  -g
RUN npm install normalize-package-data  -g
RUN npm install npm-package-arg  -g
RUN npm install call-limit  -g
RUN npm install unique-filename  -g
RUN npm install pacote  -g
RUN npm install lru-cache  -g
RUN npm install npm-install-checks  -g
RUN npm install detect-indent  -g
RUN npm install move-concurrently  -g
RUN npm install ssri  -g
RUN npm install sorted-object  -g
RUN npm install lodash.without  -g
RUN npm install lodash.uniq  -g
RUN npm install lodash.clonedeep  -g
RUN npm install safe-buffer  -g
RUN npm install path-is-inside  -g
RUN npm install fs-vacuum  -g
RUN npm install read-cmd-shim  -g
RUN npm install worker-farm  -g
RUN npm install cmd-shim  -g
RUN npm install fs-write-stream-atomic  -g
RUN npm install cacache  -g
RUN npm install mississippi  -g
RUN npm install promise-inflight  -g
RUN npm install tar  -g
RUN npm install npm-bundled  -g
RUN npm install ignore-walk  -g
RUN npm install retry -g
RUN npm install extend -g
RUN npm install json-stringify-safe -g
RUN npm install aws4 -g
RUN npm install sshpk -g
RUN npm install json-schema -g
RUN npm install stringstream -g
RUN npm install caseless -g
RUN npm install forever-agent -g
RUN npm install combined-stream -g
RUN npm install asynckit -g
RUN npm install isstream -g
RUN npm install is-typedarray -g
RUN npm install json-stable-stringify  -g
RUN npm install co  -g
RUN npm install oauth-sign  -g
RUN npm install tunnel-agent  -g
RUN npm install concat-stream  -g
RUN npm install babel-loader  -g
RUN npm install webpack-dashboard/plugin -g


RUN npm install npm@latest -g

RUN npm install --save-dev webpack
ADD ./ ./
RUN npm run build-prod
RUN cp -R ./build/*  /usr/share/nginx/html
COPY ./docker-entrypoint.sh  /var/cache/nginx/
ENTRYPOINT [ "/var/cache/nginx/docker-entrypoint.sh" ]
