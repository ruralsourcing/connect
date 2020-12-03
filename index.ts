import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";

import express from "express";
import { createEventAdapter } from "@slack/events-api";
import { createMessageAdapter } from "@slack/interactive-messages";
import { WebClient, WebAPICallResult } from "@slack/web-api";
import SlackEventAdapter from "@slack/events-api/dist/adapter";
import { EventEmitter } from "events";
import SlackMessageAdapter from "@slack/interactive-messages/dist/adapter";


const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || '';
const token = process.env.SLACK_TOKEN || '';
const port = process.env.PORT || 3000;

const slackEvents: SlackEventAdapter & EventEmitter = createEventAdapter(slackSigningSecret) as any;
const slackInteractions: SlackMessageAdapter & EventEmitter = createMessageAdapter(slackSigningSecret) as any;
const web = new WebClient(token);



(async () => {
  await web.auth.test();

  console.log("Done!");
})();

import { generateAnswerDetail } from "./generateAnswerDetail";

slackEvents.on("message", (event) => {
  console.log(
    `Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
  );
});

// Create an express application
const app = express();


app.use("/interact", slackInteractions.expressMiddleware());

slackEvents.on("url_verification", (event) => {
  return {
    challenge: event.challenge,
  };
});

/**
 * Fires when the app is mentioned in a channel. For mentions in a DM or private channel, use message.im or
 */
slackEvents.on('app_mention', (event) => {
  console.log("app_mention", event)
})


slackEvents.on('message.groups', (event) => {
  console.log("message.groups", event)
})

slackEvents.on("message", (event) => {
  console.log("Message", event);
});

slackEvents.on("message.im", (event) => {
  console.log("message.im", event);
});

// Plug the adapter in as a middleware
app.use("/events", slackEvents.expressMiddleware());

// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/slash", async (req, res) => {
  let message = await generateAnswerDetail(req.body);
  res.json(message);
});

app.post("/zoom", async (req, res) => {
  console.log("ZOOM", req.body)
})

app.get("/ping", (_, res) => {
  res.send({
    message: "pong!",
  });
});

// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = createServer(app);

server.listen(port, () => {
  // Log a message when the server is ready
  console.log(`Listening for events on ${port}`);
});

// Example of handling all message actions
slackInteractions.action({ actionId: "top-answer" }, (payload, respond) => {
  // Logs the contents of the action to the console
  console.log("payload", payload);

  // Send an additional message only to the user who made interacted, as an ephemeral message
  respond({
    text: "Thanks for your submission.",
    response_type: "ephemeral",
  });

  // If you'd like to replace the original message, use `chat.update`.
  // Not returning any value.
});

slackInteractions.action({ actionId: "zoom" }, (payload, respond) => {
  // Logs the contents of the action to the console
  console.log("payload", payload);

  // Send an additional message only to the user who made interacted, as an ephemeral message
  respond({
    text: `Authenticate to Zoom https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${process.env.ZOOM_REDIRECT_URI}`,
    response_type: "ephemeral",
  });
  // If you'd like to replace the original message, use `chat.update`.
  // Not returning any value.
});
