#!/bin/bash

if [ -z "${1}" ]; then
   version="latest"
else
   version="${1}"
fi
./build.sh
docker build --no-cache -t gennyproject/alyson2:${version} .
