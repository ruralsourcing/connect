import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";

import axios, { AxiosRequestConfig } from "axios";
axios.defaults.baseURL = process.env.API_BASE_URL || "";

import jwt_decode from "jwt-decode";
import jsonServer from "json-server";

import express from "express";
import {
  ChatPostMessageArguments,
  ConversationsOpenArguments,
  WebAPICallResult,
  WebClient,
} from "@slack/web-api";
import SessionManager from "./lib/SessionManager/SessionManager";
import MeetingManager from "./lib/MeetingManager/MeetingManager";
import MeetingContext from "./lib/MeetingManager/MeetingDataContext";

import { generateAnswerDetail } from "./generateAnswerDetail";

import SlackEventHandlers from "./handlers/SlackEventHandlers";
import SlackInteractionHandlers from "./handlers/SlackInteractionHandlers";
import UserManager from "./lib/UserManager/UserManager";
import UserDataContext from "./lib/UserManager/UserDataContext";
import { User } from "./lib/UserManager/User";
import { Session } from "./lib/SessionManager/Session";
import SessionDataContext from "./lib/SessionManager/SessionDataContext";

const sessionDataContext = new SessionDataContext();
const session = new SessionManager(sessionDataContext);

const dbContext = new MeetingContext();
const meetingManager = new MeetingManager(dbContext);

const userDataContext = new UserDataContext();
const userManager = new UserManager(userDataContext);

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || "";
const token = process.env.SLACK_TOKEN || "";
const port = process.env.PORT || 3000;
const web = new WebClient(token);

interface Profile {
  real_name: string;
  email: string;
}
interface Member {
  id: string;
  is_bot: boolean;
  team_id: string;
  name: string;
  deleted: boolean;
  profile: Profile;
}
interface UsersResponse extends WebAPICallResult {
  members: Member[];
}

(async () => {
  await web.auth.test();
})();

const slackEvents = SlackEventHandlers(slackSigningSecret);
const slackInteractions = SlackInteractionHandlers(
  slackSigningSecret,
  session,
  meetingManager
);

// Create an express application
const app = express();

app.use("/api", jsonServer.defaults());
app.use("/api", jsonServer.router("./data/db.json"));

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

interface ConversationOpenResult extends WebAPICallResult {
  channel: any;
}

// Called by Zoom API Webhook
app.post("/zoom", async (req, res) => {
  console.log("ZOOM POST", req.body);
  if (req.body.event == "meeting.started") {
    // instead of getting every user, get users based on matched skills
    console.log("PAYLOAD", req.body);
    console.log("UUID", req.body.payload.object.uuid);
    let uuid = req.body.payload.object.uuid;
    let meeting = await meetingManager.getMeeting(uuid);
    console.log("MEETING", meeting);
    if (meeting != null) {
      session.sessions.forEach((s) => {
        if (s.slackUserId !== "UPKSA9K0V") return;
        web.conversations
          .open({
            users: s.slackUserId,
          } as ConversationsOpenArguments)
          .then((result) => {
            let r = result as ConversationOpenResult;
            if (result.ok)
              web.chat
                .postMessage({
                  text: `A meeting was requested by ${s.name} for ${meeting.topic}: <${meeting?.join_url}| Join Here>`,
                  channel: r.channel.id,
                } as ChatPostMessageArguments)
                .catch(console.log);
          });
      });
    }
  }
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
  const { code, state } = req.query;
  if (code) {
    let userData;
    if (state) {
      userData = JSON.parse(
        Buffer.from(state as string, "base64").toString("utf-8")
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

    let token = jwt_decode<any>(response.data.access_token);
    if (userData) {
      session.addAuthorization(
        userData.teamId,
        userData.userId,
        response.data.access_token,
        token.uid
      );
      res.json(session.session(userData.teamId, userData.userId));
    } else {
      res.sendStatus(200);
    }
  } else {
    res.send(500);
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

app.get("/sessions", (req, res) => {
  res.json(session.sessions);
});

app.get("/meetings", async (_, res) => {
  res.json(await meetingManager.getAll());
});

app.post("/meetings", async (req, res) => {
  await meetingManager.addMeeting({
    uuid: "JtcANK6eSaWGRSAgN8xg+Q==",
    id: 1,
    host_id: "eyxXfnupQvWNjXJcNoD7Xg",
    host_email: "david@federnet.com",
    topic: "CASpR Support",
    start_url:
      "https://zoom.us/s/93398173560?zak=eyJ6bV9za20iOiJ6bV9vMm0iLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwiaXNzIjoid2ViIiwic3R5IjoxLCJ3Y2QiOiJhdzEiLCJjbHQiOjAsInN0ayI6InQ5NUNKWG1rcHo0U0lkMV9aUndTOUduZElhdlNMRGtja3U5aFh2LVcwbUEuQUcuTTFxWFcxc3d0Zmw2TWFQR21hVHczWnU0V0I5Vmt3S1hoc3h5Uk1telplVFBaeXBZMk9lY0RzblpUclJqREMxWExubTJTeFk5djNHS0NwNC5KTGFBZWNkcjJIZ2N6TVFyMllvNE9BLk44bnJubEhSVlA0OFROTVQiLCJleHAiOjE2MDcyMDg0NzgsImlhdCI6MTYwNzIwMTI3OCwiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImNpZCI6IiJ9.NXPpvZRL80AVFMVyqaXhKO1hKywkFbYyze48LtOxTWw",
    join_url:
      "https://zoom.us/j/93398173560?pwd=c2dnaFMzTzkvSmgzZnhaUVZYb2lwdz09",
    password: "u4UrGs",
  });
  res.sendStatus(200);
});

app.get("/ping", (_, res) => {
  res.send({
    message: "pong!",
  });
});

app.post("/users", async (req, res) => {
  let slackUsers = (await web.users.list()) as UsersResponse;
  const users = await userDataContext.getAll();
  console.log(slackUsers);
  slackUsers.members.forEach(async (member) => {
    if (member.deleted || member.is_bot || member.name == "slackbot") return;
    // let userSession = session.session(member.team_id, member.id);
    // userSession.email = member.profile.email;
    // userSession.name = member.profile.real_name;
    let user = users.find((u) => u.session.slackUserId == member.id);
    if (user) return;
    else {
      let newUser = await userManager.addUser({
        name: member.name
      } as User);
      await session._context.post({
        userId: newUser.id,
        email: member.profile.email,
        slackTeamId: member.team_id,
        slackUserId: member.id,
        name: member.name,
      } as Session,)
    }
  });
  res.sendStatus(200);
});

app.delete("/users", async (_, res) => {
  await userManager.delete();
  res.sendStatus(200);
});

// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = createServer(app);

server.listen(port, () => {
  // Log a message when the server is ready
  console.log(`Listening for events on ${port}`);
});
