#!/bin/bash
docker rm blader-app
docker rmi blader:dev
docker compose up --build