#!/bin/bash
IFS='
'
for x in `env`; do
  key=$(echo $x | cut -f 1 -d =);
  value=$(echo $x | cut -f 2 -d =);
  sed -i "s={{$key}}=$value=g" /usr/share/nginx/html/js/bundle.min.js
done
nginx -g "daemon off;"
