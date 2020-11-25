const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { createEventAdapter } = require('@slack/events-api');
const { createMessageAdapter } = require('@slack/interactive-messages');
const { response } = require('express');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackInteractions = createMessageAdapter(slackSigningSecret);

slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  });

// Create an express application
const app = express();

// Plug the adapter in as a middleware
app.use('/events', slackEvents.requestListener());

app.use('/interactions', slackInteractions.requestListener());

app.use('/ping', (_, res) => {
    res.send({
        message: 'pong!'
    })
})

// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
app.use(bodyParser());

// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = createServer(app);
server.listen(port, () => {
  // Log a message when the server is ready
  console.log(`Listening for events on ${server.address().port}`);
});