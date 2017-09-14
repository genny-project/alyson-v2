#!/bin/bash

GENNY_PROP_FILE=/usr/share/nginx/html/genny.properties.json
PACKAGE_FILE=/usr/share/nginx/html/package.json
KEYCLOAK_JSON=/usr/share/nginx/html/keycloak.json

#echo "module.exports = {"  > $GENNY_PROP_FILE
echo "{" > $GENNY_PROP_FILE
# update the genny.properties.json file with env

for i in `set | awk -F "=" '{print $1}' | grep ".*REACT_APP.*"`
do
PS1=`printf '%s\n' "${!i}"`
  echo "    \"$i\": \""$PS1"\"," >> $GENNY_PROP_FILE
done
#remove trailing comma
sed -ie '$ s/,$//' $GENNY_PROP_FILE 
echo "}" >> $GENNY_PROP_FILE


# change the package.json file
function escape_slashes {
    sed 's/\//\\\//g'
}

function change_line {
    local OLD_LINE_PATTERN=$1; shift
    local NEW_LINE=$1; shift
    local FILE=$1

    local NEW=$(echo "${NEW_LINE}" | escape_slashes)
    /bin/sed -i  '/'"${OLD_LINE_PATTERN}"'/s/.*/'"${NEW}"'/' "${FILE}"
}

if [ -z "${REACT_APP_HOSTNAME}" ]; then
   version="latest"
else
   OLD_LINE_KEY="homepage": "http://localhost:3000",
   NEW_LINE="homepage": "$REACT_APP_HOSTNAME",
   change_line $OLD_LINE_KEY $NEW_LINE $PACKAGE_FILE
fi
if [ -z "${REACT_APP_KEYCLOAK_URL}" ]; then
   version="latest"
else
   OLD_LINE_KEY="auth-server-url": "http://localhost:8180/auth",
   NEW_LINE="homepage": "$REACT_APP_KEYCLOAK_URL",
   change_line $OLD_LINE_KEY $NEW_LINE $KEYCLOAK_JSON
fi

nginx -g "daemon off;"
