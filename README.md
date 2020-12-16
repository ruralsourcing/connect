# Get Started 

## Step One: 


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

# Docker
Use docker-compose -f ./docker/docker-compose.dev.yml build to create the docker image

docker-compose -f ./docker/docker-compose.dev.yml up to start

Both server and www folders are HMR enabled.

## APP Service
### Configuration
Several environment variables are needed for the docker app to run:

**QNAMAKER_KEY**={QnA Maker Key}  
**QNAMAKER_ENDPOINT**={QnA Maker App Endpoint}  
**QNAMAKER_KNOWLEDGE_BASE_ID**={QnA Maker Knowledgebase ID}  

**AZURE_SUBSCRIPTION_ID**={Your Azure Subscription ID}  

**SLACK_SIGNING_SECRET**={From Slack App Configuration}  
**SLACK_TOKEN**={From Slack App Configuration}  

**ZOOM_CLIENT_ID**={Zoom APP Client ID}  
**ZOOM_CLIENT_SECRET**={Zoom APP Client Secret}  
**ZOOM_REDIRECT_URI**={Zoom APP Redirect URI}  

**API_BASE_URL**={Base URL of Application}  

**DATABASE_URL**={Database Connection String}  

## DB Service