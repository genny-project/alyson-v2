FROM nginx:alpine
RUN /bin/sh -c "apk add --no-cache bash"

COPY ./dist  /usr/share/nginx/html
#COPY ./genny.properties.js /usr/share/nginx/html/
COPY ./docker-entrypoint.sh  /var/cache/nginx/
#CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT [ "/var/cache/nginx/docker-entrypoint.sh" ]

#CMD ["-g", "0.0.0.0"]
