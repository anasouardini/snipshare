#!/bin/bash

docker-compose -f docker-compose.yaml up

# if [[ ! $1 = 'dev' && ! $1 = 'prod' || ! $2 = 'down' && ! $2 = 'up' ]]; then
#     echo "usage: deploy.sh (dev|prod) (up|down)";
#     echo "up: start/restart";
#     echo "down: kill";
#     exit 1;
# fi

# # nav to where docker compose file is
# cd "$(dirname $0)/.."

# # deploying
# mainCompose="docker-compose.yaml";
# envCompose="docker-compose.${1}.yaml";
# action=$2;
# docker-compose -f $mainCompose -f $envCompose $action