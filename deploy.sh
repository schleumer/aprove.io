#!/usr/bin/env bash

docker stack rm aprove-io

docker stack deploy --compose-file=docker-compose.yml --with-registry-auth aprove-io