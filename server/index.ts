import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// const t = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImUxOTdiZjJlODdiZDE5MDU1NzVmOWI2ZTVlYjQyNmVkYTVkNTc0ZTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MDc0Mzg3ODg2MTktZnU4a3FpN2hqZWQ3NHZoMzJwbDhiMjM4ZGI0amRyZmsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MDc0Mzg3ODg2MTktZnU4a3FpN2hqZWQ3NHZoMzJwbDhiMjM4ZGI0amRyZmsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTY2ODY4ODM0NTI0NjAyNDYxODciLCJoZCI6ImZlZGVybmV0LmNvbSIsImVtYWlsIjoiZGF2aWRAZmVkZXJuZXQuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJCR3RKNmFvWUwwZVdldGdtRUQtb3V3IiwibmFtZSI6IkRhdmlkIEZlZGVyc3BpZWwiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lVVHpuSGNQQ0QxclNVRmlaR1YyR0YydUhwdWptMkZLaHdZS0JrT3c9czk2LWMiLCJnaXZlbl9uYW1lIjoiRGF2aWQiLCJmYW1pbHlfbmFtZSI6IkZlZGVyc3BpZWwiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTYwODM0OTc3NiwiZXhwIjoxNjA4MzUzMzc2fQ.Xj8338uof5r5fzE80k0vVZ2496cb-SZSMv2Qao-kUfULFXkptZHXAeVPClDxhwWwRIi22MzUutdFaGiQP63LwurEyrxOPxl9mu6d6hFF1d69LINgdVVfXeHlNW3CxR2NnGR_vVEt25iEcZdV9QDNPFaitp1bEBoLcnbtT7HyDUzR85GXCyQJptFsgi047eiAqRhO0eScOIt2pzpXFrVBF09cYmAnf52ivqrb5IedAcELUxr1XadOX8H5zKhOsmxrvaaJO8D2eDRQ0-TFdUVhO9Vt0vZBfgxWsbgpIPjIMQ0cF73Pttjjn--bO-sg9_H2DEjjpUk-8D5rBdADaM1SQQ';
// import jwt from 'jsonwebtoken';

// const test = jwt.verify(t, process.env.GOOGLE_CLIENT_SECRET || '');
// console.log(test);
import { createServer } from "http";

import axios, { AxiosRequestConfig } from "axios";
axios.defaults.baseURL = process.env.API_BASE_URL || "";

import jwt_decode from "jwt-decode";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import express, { response } from "express";
import {
  ChatPostMessageArguments,
  ConversationsOpenArguments,
  WebAPICallResult,
  WebClient,
} from "@slack/web-api";
import SessionManager from "./lib/SessionManager/SessionManager";
import MeetingManager from "./lib/MeetingManager/MeetingManager";
import MeetingContext from "./lib/MeetingManager/MeetingDataContext";

import { generateAnswerDetail } from "./lib/generateAnswerDetail";

import SlackEventHandlers from "./handlers/SlackEventHandlers";
import SlackInteractionHandlers from "./handlers/SlackInteractionHandlers";
import UserManager from "./lib/UserManager/UserManager";
import UserDataContext from "./lib/UserManager/UserDataContext";
import SessionDataContext from "./lib/SessionManager/SessionDataContext";
import history from 'connect-history-api-fallback';

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
                  text: `A meeting was requested by ${s.name} for ${meeting?.topic}: <${meeting?.join_url}| Join Here>`,
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

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: [
    "openid",
    "email",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
  prompt: 'consent'
});

// app.get("/login", (req, res) => {
//   res.json({ url });
// });

// app.post("/login", async (req, res) => {
//   console.log(req.body);
//   if (req?.body?.code) {
//     // Now that we have the code, use that to acquire tokens.
//     try {
//       const { tokens } = await oauth2Client.getToken(req.body.code);
//       oauth2Client.setCredentials(tokens);

//       const { data } = await google.oauth2("v2").userinfo.get({
//         oauth_token: tokens.access_token ? tokens.access_token : undefined,
//       });
//       console.log(data);

//       if (!data.email) throw "email is required beyond this point";

//       let user = await prisma.user.findUnique({
//         where: {
//           email: data.email,
//         },
//       });
//       if (!user) {
//         await prisma.user.create({
//           data: {
//             email: data.email,
//             domain: data.hd,
//             Profile: {
//               create: {
//                 name: data.name,
//                 familyName: data.family_name,
//                 givenName: data.given_name,
//                 picture: data.picture,
//               },
//             },
//             ZoomAuth: {
//               create: {
//                 token: "test",
//               },
//             },
//           },
//         });
//       } else {
//         console.log('user already exists, skip or update?');
//       }
//       res.json(tokens);
//       // if (data) data.console.log(data);
//     } catch (ex) {
//       console.log(ex);
//       res.sendStatus(500);
//     }
//   }
 
// });

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

app.get("/users", async (req, res) => {
  let users;
  try {
    users = await prisma.user.findMany({
      take: 5,
      include: {
        Profile: true,
        ZoomAuth: true,
      }
    });
  } catch (ex) {
    console.log(ex);
    res.send(ex);
  }
  if (users) res.json(users);
  else res.sendStatus(200);
});


app.use(history({
  logger: console.log.bind(console)
}));

app.use("/", express.static("www/build"));

const server = createServer(app);

server.listen(port, () => {
  console.log(`Listening for events on ${port}`);
});
