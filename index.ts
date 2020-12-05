import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import axios, { AxiosRequestConfig } from "axios";
import jwt_decode from "jwt-decode";

import express from "express";
import { WebClient } from "@slack/web-api";
import SessionManager from "./lib/SessionManager/SessionManager";

const session = new SessionManager();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || "";
const token = process.env.SLACK_TOKEN || "";
const port = process.env.PORT || 3000;
const web = new WebClient(token);

(async () => {
  await web.auth.test();

  console.log("Done!");
})();

import { generateAnswerDetail } from "./generateAnswerDetail";

import SlackEventHandlers from "./handlers/SlackEventHandlers";
const slackEvents = SlackEventHandlers(slackSigningSecret);

import SlackInteractionHandlers from "./handlers/SlackInteractionHandlers";
const slackInteractions = SlackInteractionHandlers(slackSigningSecret, session);

// Create an express application
const app = express();

// Plug the adapter in as a middleware
app.use("/interact", slackInteractions.expressMiddleware());
app.use("/events", slackEvents.expressMiddleware());

// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
// ALWAYS PUT BEFORE REGULAR ROUTES
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/slash", async (req, res) => {
  let message = await generateAnswerDetail(req.body);
  res.json(message);
});

app.post("/zoom", (req, res) => {
  console.log("ZOOM POST", req.body);
  /*
    MEETING STARTED: Time to DM others
    ZOOM POST {
      event: 'meeting.started',
      payload: {
        account_id: 'u_zReRmhRYiKcE6w7aAZhg',
        object: {
          duration: 60,
          start_time: '2020-12-04T08:54:27Z',
          timezone: 'America/Indianapolis',
          topic: 'CASpR Support',
          id: '98522741440',
          type: 1,
          uuid: 'JOeiPNgGSaGslOD6+uNLjQ==',
          host_id: 'eyxXfnupQvWNjXJcNoD7Xg'
        }
      }
    }

    MEETING ENDED: Time to Retrospect
    ZOOM POST {
      event: 'meeting.ended',
      payload: {
        account_id: 'u_zReRmhRYiKcE6w7aAZhg',
        object: {
          duration: 60,
          start_time: '2020-12-04T08:54:27Z',
          timezone: 'America/Indianapolis',
          end_time: '2020-12-04T08:55:45Z',
          topic: 'CASpR Support',
          id: '98522741440',
          type: 1,
          uuid: 'JOeiPNgGSaGslOD6+uNLjQ==',
          host_id: 'eyxXfnupQvWNjXJcNoD7Xg'
        }
      }
    }
  */
  res.sendStatus(200);
});

app.post("/zoom", (req, res) => {
  console.log("POST ZOOM EVENT", req.body);
});

app.get("/zoom", async (req, res) => {
  console.log("ZOOM REQUEST", req.query);
  if (req.query && req.query.code) {
    let userData;
    if (req.query.state) {
      userData = JSON.parse(
        Buffer.from(req.query.state as string, "base64").toString("utf-8")
      );
      console.log(userData);
    }

    let response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.ZOOM_REDIRECT_URI,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    } as AxiosRequestConfig);
    console.log("AXIOS AUTH CODE RESPONSE", response.data);
    let token = jwt_decode<any>(response.data.access_token);
    session.addAuthorization(
      userData.teamId,
      userData.userId,
      response.data.access_token,
      token.uid
    );
    res.json(session.session(userData.teamId, userData.userId));
  } else {
    res.send(500);
  }
});

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
