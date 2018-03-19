#!/bin/bash

ENV_FILE=genny.env
LOCAL_REALM_NAME="PROJECT_REALM=$2"

./create_genny_env.sh ${ENV_FILE} $1

#Add any dev env file if exists
if [ $LOCAL_REALM_NAME ]; then
    echo  $LOCAL_REALM_NAME  >> $ENV_FILE
fi

ENV_FILE=$ENV_FILE docker-compose up -d
