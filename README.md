# Get Started 
## Prerequisites
[Docker Desktop](https://www.docker.com/products/docker-desktop)

## Installation:

**Build the dev environment**
```
docker-compose build
```
**Start the environment**
```
docker-compose up
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

**B2C_AUTHORITY**=https://codeflyb2c.b2clogin.com/codeflyb2c.onmicrosoft.com
**B2C_LOGIN_POLICY**=B2C_1_CASpR
**B2C_APPLICATION_ID**=2b08acb3-4c70-4b1f-8925-b00158883f1a
**B2C_KNOWN_AUTHORITIES**=codeflyb2c.b2clogin.com

**JWT_KID**=X5eXk4xyojNFum1kl2Ytv8dlNP4-c57dO6QGTVBwaNk

## DB Service