# Get Started 
## Prerequisites
[Docker Desktop](https://www.docker.com/products/docker-desktop)

## Installation:

---
Several environment variables are needed for the docker app to run:

Create a `/docker/app/.env` file and add the following: (Slack David Federspiel for testing values)  

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

**B2C_AUTHORITY**={B2C_AUTHORITY}
**B2C_LOGIN_POLICY**={B2C_POLICY}
**B2C_APPLICATION_ID**={B2C_APP_ID} 
**B2C_KNOWN_AUTHORITIES**={B2C_KNOWN_AUTHORITIES} 

**JWT_KID**={B2C_SIGNING_KEY}

Create a `/docker/db/.env` file and add the following:   
**POSTGRES_USER**=user  
**POSTGRES_PASSWORD**=postgres  
**POSTGRES_DB**=db  

---

Open a terminal to the root of this repository:
**Install dependencies**
```
yarn run setup
```
**Build the dev environment**
```
docker-compose build
```
**Start the environment**
```
docker-compose up
```

---

## What Next?  
That's it, you can start changing files.