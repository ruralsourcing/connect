# Get Started  

Fist things first
```
yarn install
```
Build the dev environment:
```
docker-compose -f ./docker/docker-compose.dev.yml build
```
An run the environment:
```
docker-compose -f ./docker/docker-compose.dev.yml up
```

## What Next?
Now you can start changing files. The Docker image is set up with Express, React and Postgres.

# Azure Deployment
Uses github actions
-- create secrets in github repo
-- create app service with docker deploy
-- create container registry
-- modify github YAML to build and deploy container
-- WEBSITE_PORTS env var to expose internal port

# Docker
Use docker-compose -f ./docker/docker-compose.dev.yml build to create the docker image

docker-compose -f ./docker/docker-compose.dev.yml up to start

Both server and www folders are HMR enabled.