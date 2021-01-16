import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
// import https from "https";
// import fs from "fs";

import axios from "axios";
axios.defaults.baseURL = process.env.API_BASE_URL || "";

import express from "express";
import history from "connect-history-api-fallback";

import { generateAnswerDetail } from "./lib/generateAnswerDetail";
import SlackEventHandlers from "./handlers/SlackEventHandlers";
import SlackInteractionHandlers from "./handlers/SlackInteractionHandlers";
import SkillController from "./controllers/SkillController";
import ZoomController from "./controllers/ZoomController";
import MeetingController from "./controllers/MeetingController";
import UserController from "./controllers/UserController";
import apollo from "./graphql/server";
import { AuthContext } from "./middleware/AuthContext";
import { UserContext } from "./middleware/UserContext";
import UserDataContext from "./data/UserDataContext";
import SkillDataContext from "./data/SkillDataContext";
import MeetingDataContext from "./data/MeetingDataContext";
import ZoomDataContext from "./data/ZoomDataContext";
import TechDataContext from "./data/TechDataContext";
import TechController from "./controllers/TechController";

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || "";
const port = process.env.PORT || 3000;


const slackEvents = SlackEventHandlers(slackSigningSecret);
const slackInteractions = SlackInteractionHandlers(slackSigningSecret);

// Create an express application
const app = express();

const userDataContext = new UserDataContext();
const authContext = new AuthContext(userDataContext);
app.use(authContext.middleware);

// Plug the adapter in as a middleware
app.use("/interact", slackInteractions.expressMiddleware());
app.use("/events", slackEvents.expressMiddleware());
// Example: If you're using a body parser, always put it after the event adapter in the middleware stack

// ALWAYS PUT BEFORE REGULAR ROUTES
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/slash", async (req, res) => {
  console.log(req.body, process.env);
  try {
    let message = await generateAnswerDetail(req.body);
    res.json(message);
  } catch (ex) {
    console.log(ex);
    res.sendStatus(500);
  }
});

app.get("/policy", (req, res) => {
  res.send("<h1>Policy...</h1>");
});
app.get("/terms", (req, res) => {
  res.send("<h1>Terms...</h1>");
});
app.get("/support", (req, res) => {
  res.send("<h1>Support...</h1>");
});
app.get("/documentation", (req, res) => {
  res.send("<h1>Documentation...</h1>");
});

app.get("/ping", (_, res) => {
  res.send({
    message: "pong!",
  });
});

const router = express.Router();

const skillDataContext = new SkillDataContext();
const meetingDataContext = new MeetingDataContext();
const zoomDataContext = new ZoomDataContext();
const techDataContext = new TechDataContext();

new SkillController(router, skillDataContext);
new ZoomController(router, zoomDataContext);
new MeetingController(router, meetingDataContext);
new UserController(router, userDataContext);
new TechController(router, techDataContext);

app.use("/api", UserContext, router);

const httpServer = createServer(app);

apollo.applyMiddleware({ app });
apollo.installSubscriptionHandlers(httpServer);

app.use(
  history({
    logger: console.log.bind(console),
  })
);

app.use("/", express.static("www/build"));

httpServer.listen(port, () => {
  console.log(`Server started at: http://localhost:${port}`);
  console.log(
    `GraphQL Playground ready at http://localhost:${port}/${apollo.graphqlPath}`
  );
  console.log(
    `Subscriptions ready at ws://localhost:${port}/${apollo.subscriptionsPath}`
  );
});

// https
//   .createServer(
//     {
//       key: fs.readFileSync(__dirname + "/certs/server.key"),
//       cert: fs.readFileSync(__dirname + "/certs/cert.pem"),
//     },
//     app
//   )
//   .listen(port, () => {
//     console.log(`Secure server started at: https://localhost:${port}`);
//     console.log(
//       `GraphQL started at: https://localhost:${port}${apollo.graphqlPath}`
//     );
//     console.log(
//       `Subscriptions ready at wss://localhost:${port}${apollo.subscriptionsPath}`
//     );
//   });
