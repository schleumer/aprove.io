#!/usr/bin/env bash

docker build -t registry.gitlab.com/wesley.schleumer/aprove.io/frontend:latest .
docker push registry.gitlab.com/wesley.schleumer/aprove.io/frontend:latest
