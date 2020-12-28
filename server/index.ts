import dotenv from "dotenv";
dotenv.config();

import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

// let client = jwksClient({
//   jwksUri:
//     "https://codeflyb2c.b2clogin.com/codeflyb2c.onmicrosoft.com/B2C_1_CASpR/discovery/v2.0/keys",
// });
// let tk =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE2MDg5NTE4NDcsIm5iZiI6MTYwODk0ODI0NywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9jb2RlZmx5YjJjLmIyY2xvZ2luLmNvbS8zOTZiZTFiMy1kM2MzLTRlYWMtYjdhZS0wZDNhNGQwOGU5ZGEvdjIuMC8iLCJzdWIiOiIxN2I4Njg4MS1kYzNiLTQ5NmEtYWE3OS1jZjZmZDVlZmFlZTciLCJhdWQiOiIyYjA4YWNiMy00YzcwLTRiMWYtODkyNS1iMDAxNTg4ODNmMWEiLCJub25jZSI6IjgyZmI2ZWNhLWVkNWEtNDQ4MS1iNGMwLWYwMzc4NzJlNGVjOSIsImlhdCI6MTYwODk0ODI0NywiYXV0aF90aW1lIjoxNjA4OTQ4MjQ3LCJuYW1lIjoiRGF2aWQgRmVkZXJzcGllbCIsImlkcCI6Imdvb2dsZS5jb20iLCJjaXR5IjoiRk9SVCBXQVlORSIsImVtYWlscyI6WyJkYXZpZEBmZWRlcm5ldC5jb20iXSwidGZwIjoiQjJDXzFfQ0FTcFIifQ.BnCNzBnEhkPn6Ia6BeQooTZzPBPqpb6Akqa6M8mskXv0RROX9GMbCBOFqOlNNlaLOrdx7z1Uc8ziRCllw_N4HgvF8jt2LdX2FCp6QiPh6wT1nDHQp9-Sc-qlZMoi32J05uzyWwRnbw0EtQp1rMli4xHSmA5hD-NNixj64ba3Y1w5pSvcQLfXrdk63ryD5tLeTPlLn-QAQ-WwmbrLyXh23tMIl-Bsuq-XZxMnB46TSFmQFEPsk7DSolUTmvtJKamSrR121oB8IpQarvU7nAl0lDwiVJhjQFppjIh7IlTWvmAliyU-3Ku7i3pNL-gEsEkU5aiL3ZKHf2OPFv-AhOYx5Q";
// const t =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE2MDg4ODIwNzksIm5iZiI6MTYwODg3ODQ3OSwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9jb2RlZmx5YjJjLmIyY2xvZ2luLmNvbS8zOTZiZTFiMy1kM2MzLTRlYWMtYjdhZS0wZDNhNGQwOGU5ZGEvdjIuMC8iLCJzdWIiOiIxN2I4Njg4MS1kYzNiLTQ5NmEtYWE3OS1jZjZmZDVlZmFlZTciLCJhdWQiOiIyYjA4YWNiMy00YzcwLTRiMWYtODkyNS1iMDAxNTg4ODNmMWEiLCJub25jZSI6ImVlMWM3MDM3LWIwMGYtNGQxYy05NDhhLWM3Nzg3ZmZlM2QwNyIsImlhdCI6MTYwODg3ODQ3OSwiYXV0aF90aW1lIjoxNjA4ODc4NDc5LCJuYW1lIjoiRGF2aWQgRmVkZXJzcGllbCIsImlkcCI6Imdvb2dsZS5jb20iLCJjaXR5IjoiRk9SVCBXQVlORSIsImVtYWlscyI6WyJkYXZpZEBmZWRlcm5ldC5jb20iXSwidGZwIjoiQjJDXzFfQ0FTcFIifQ.GAiqHLwY9QHeq7NTRLr1y9eJTKDClc7Gl92yogBUDat3S71MbT8Xh0FOdLPDogE2aDK4lSZCl0tnWxnQG9KdfEbOW37lkoRTcBQ8mDfmBbeNndWmBgpQEj8NWG3KlOVsst_nHqgdtTzOGf_DOaVZSIImToIkxhalNlDFbNe2N0gOK9sOGJH9acc_xOLyFsgFFYN1cKW6lINimjvA7URQuEKOjE7CCprTj2mEuJ4vF7k2M_IPOWb3QblQQ9Tge6l_h30U_GlD6ECdrvYWvVgGfG3v011AqN0kiS1EBpCGXt8n8g0dUoyA9pO6kfL5weC1EL7Dmn_tCD9VhLr3Pff2ow";

// client.getSigningKey(
//   "X5eXk4xyojNFum1kl2Ytv8dlNP4-c57dO6QGTVBwaNk",
//   (err, key) => {
//     if (err != null) {
//       console.log("err:" + err);
//     } else {
//       const signingKey = key.getPublicKey();
//       console.log("signingKey:" + signingKey);
//       try {
//         const decoded: any = jwt.verify(tk, signingKey, {
//           algorithms: ["RS256"],
//         });
//         console.log(
//           "decoded with signature verification: " + JSON.stringify(decoded)
//         );
//       } catch (ex) {
//         console.log(ex);
//       }
//     }
//   }
// );
// public key https://codeflyb2c.b2clogin.com/codeflyb2c.onmicrosoft.com/B2C_1_CASpR/discovery/v2.0/keys
// const k = '-----BEGIN PUBLIC KEY-----\ntVKUtcx_n9rt5afY_2WFNvU6PlFMggCatsZ3l4RjKxH0jgdLq6CScb0P3ZGXYbPzXvmmLiWZizpb-h0qup5jznOvOr-Dhw9908584BSgC83YacjWNqEK3urxhyE2jWjwRm2N95WGgb5mzE5XmZIvkvyXnn7X8dvgFPF5QwIngGsDG8LyHuJWlaDhr_EPLMW4wHvH0zZCuRMARIJmmqiMy3VD4ftq4nS5s8vJL0pVSrkuNojtokp84AtkADCDU_BUhrc2sIgfnvZ03koCQRoZmWiHu86SuJZYkDFstVTVSR0hiXudFlfQ2rOhPlpObmku68lXw-7V-P7jwrQRFfQVXw\n-----END PUBLIC KEY-----';
// import jwt from 'jsonwebtoken';

// const test = jwt.verify(t, k,{ algorithms: ['RS256']},  (err, decoded) => {
//   console.log(err, decoded);
// });

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
import history from "connect-history-api-fallback";

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

app.use(async (req, res, next) => {
  console.log(req);
  next()
})

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

// const url = oauth2Client.generateAuthUrl({
//   access_type: "offline",
//   scope: [
//     "openid",
//     "email",
//     "https://www.googleapis.com/auth/userinfo.email",
//     "https://www.googleapis.com/auth/userinfo.profile",
//   ],
//   prompt: 'consent'
// });

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
      take: 10,
      include: {
        Profile: true,
        ZoomAuth: true,
      },
    });
  } catch (ex) {
    console.log(ex);
    res.send(ex);
  }
  if (users) res.json(users);
  else res.sendStatus(200);
});

app.use(
  history({
    logger: console.log.bind(console),
  })
);

app.use("/", express.static("www/build"));

const server = createServer(app);

server.listen(port, () => {
  console.log(`Listening for events on ${port}`);
});
