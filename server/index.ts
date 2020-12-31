import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";

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
import { AuthContext } from "./middleware/AuthContext"; //
import { UserContext } from "./middleware/UserContext";
import UserManager from './lib/UserManager/UserManager';
import UserDataContext from "./lib/UserManager/UserDataContext";

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || "";
const port = process.env.PORT || 3000;

const slackEvents = SlackEventHandlers(slackSigningSecret);
const slackInteractions = SlackInteractionHandlers(slackSigningSecret);

// Create an express application
const app = express();

var sess = {
  secret: 'keyboard cat',
  cookie: {
    secure: false
  }
}

const userDataContext = new UserDataContext();
const userManager = new UserManager(userDataContext);
const userContext = new AuthContext(userManager);
app.use(userContext.middleware);

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

// app.use((req, _, next) => {
//   const user = req.app.get("user");
//   if (user) console.log("[REQUEST USER]", req.app.get("user"));
//   else console.log("[ANONYMOUS REQUEST]");
//   next();
// });

const router = express.Router();

new SkillController(router);
new ZoomController(router);
new MeetingController(router);
new UserController(router);

app.use('/api', UserContext, router);

const server = createServer(app);
apollo.applyMiddleware({ app });
apollo.installSubscriptionHandlers(server);
app.use(
  history({
    logger: console.log.bind(console),
  })
);

app.use("/", express.static("www/build"));

server.listen(port, () => {
  console.log(`Listening for events on ${port}`);
});
