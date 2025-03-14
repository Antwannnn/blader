#!/bin/bash
docker rm blader
docker rmi blader:prod
docker build -f Dockerfile.production -t blader:prod .
docker run -p 3000:3000 --env-file .env.production --name blader blader:prod 