require("dotenv").config();

const { createServer } = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");
const { WebClient } = require("@slack/web-api");
const { response } = require("express");
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_TOKEN;
console.log(token);

const port = process.env.PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackInteractions = createMessageAdapter(slackSigningSecret);
const web = new WebClient(token);
(async () => {
  await web.auth.test();

  console.log("Done!");
})();

const generateAnswerDetail = require("./generateAnswerDetail");

slackEvents.on("message", (event) => {
  console.log(
    `Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
  );
});

// Create an express application
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded










slackEvents.on("url_verification", (event) => {
  return {
    challenge: event.challenge,
  };
});

slackEvents.on("app_mention", (event) => {});

// Plug the adapter in as a middleware
app.use("/events", slackEvents.requestListener());







// Example of handling all message actions
slackInteractions.action({ actionId: "top-answer" }, (payload) => {
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

slackInteractions.action({}, (payload, respond) => {
  console.log("HERE");
});

// app.use("/interactions", slackInteractions.requestListener());


app.post("/interactions", (req, res) => {
    console.log("EXPRESS ENDPOINT");
    res.sendStatus(200);
})



app.post("/slash", async (req, res) => {
  let message = await generateAnswerDetail(req.body);
  res.json(message);
});






app.get("/ping", (_, res) => {
  res.send({
    message: "pong!",
  });
});










// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
app.use(bodyParser());

// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = createServer(app);
server.listen(port, () => {
  // Log a message when the server is ready
  console.log(`Listening for events on ${server.address().port}`);
});
