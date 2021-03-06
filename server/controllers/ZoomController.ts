import { IRouter, response } from "express";
import SessionManager from "../lib/SessionManager/SessionManager";
import SessionDataContext from "../lib/SessionManager/SessionDataContext";
import {
  WebAPICallResult,
  WebClient,
} from "@slack/web-api";
import { IZoomDataContext } from "../data/ZoomDataContext";
import { ZoomAuth } from "@prisma/client";
import { PubSub } from "apollo-server-express";
import { MEETING_STARTED } from "../graphql/resolvers/MeetingsResolvers";

const sessionDataContext = new SessionDataContext();
const session = new SessionManager(sessionDataContext);

const token = process.env.SLACK_TOKEN || "";
const web = new WebClient(token);

interface ConversationOpenResult extends WebAPICallResult {
  channel: any;
}

export default class ZoomController {
  private path: string = "/zoom";
  private router: IRouter;
  private context: IZoomDataContext;
  private pubsub: PubSub;
  constructor(router: IRouter, context: IZoomDataContext, pubsub: PubSub) {
    this.router = router;
    this.context = context;
    this.pubsub = pubsub;
    this.initialize();
  }

  private initialize = () => {
    // this.router.get(`${this.path}`, this.getAllMeetings);
    this.router.post(`${this.path}`, this.createMeeting);
  };

//   private getAllMeetings = async (_, res: { json: ( meetings: ZoomAuth[]) => void}) => {
//     console.log("[MEETING GET]");
//     res.json(await this.context.getAll())
//   };

  private createMeeting = async (req: any, res: any) => {
    console.log("[MEETING CREATE]");
    this.pubsub.publish(MEETING_STARTED, {
      request: req.body
    });
    console.log("DONE");
    res.sendStatus(200);
  };

  //routes() {
  // this.app.get(
  //   "/api/skills",
  //   authCheck,
  //   async (req, res) => res.json(await this.manager.getAll())
  // );
  // this.app.post("/zoom", async (req, res) => {
  //   console.log("ZOOM POST", req.body);
  //   if (req.body.event == "meeting.started") {
  //     console.log("PAYLOAD", req.body);
  //     console.log("UUID", req.body.payload.object.uuid);
  //     let uuid = req.body.payload.object.uuid;
  //     let meeting = await this.manager.getMeeting(uuid);
  //     console.log("MEETING", meeting);
  //     if (meeting != null) {
  //       session.sessions.forEach((s) => {
  //         if (s.slackUserId !== "UPKSA9K0V") return;
  //         web.conversations
  //           .open({
  //             users: s.slackUserId,
  //           } as ConversationsOpenArguments)
  //           .then((result) => {
  //             let r = result as ConversationOpenResult;
  //             if (result.ok)
  //               web.chat
  //                 .postMessage({
  //                   text: `A meeting was requested by ${s.name} for ${meeting?.topic}: <${meeting?.join_url}| Join Here>`,
  //                   channel: r.channel.id,
  //                 } as ChatPostMessageArguments)
  //                 .catch(console.log);
  //           });
  //       });
  //     }
  //   }
  //   /*
  //       MEETING STARTED: Time to DM others
  //       ZOOM POST {
  //         event: 'meeting.started',
  //         payload: {
  //           account_id: 'u_zReRmhRYiKcE6w7aAZhg',
  //           object: {
  //             duration: 60,
  //             start_time: '2020-12-04T08:54:27Z',
  //             timezone: 'America/Indianapolis',
  //             topic: 'CASpR Support',
  //             id: '98522741440',
  //             type: 1,
  //             uuid: 'JOeiPNgGSaGslOD6+uNLjQ==',
  //             host_id: 'eyxXfnupQvWNjXJcNoD7Xg'
  //           }
  //         }
  //       }

  //       MEETING ENDED: Time to Retrospect
  //       ZOOM POST {
  //         event: 'meeting.ended',
  //         payload: {
  //           account_id: 'u_zReRmhRYiKcE6w7aAZhg',
  //           object: {
  //             duration: 60,
  //             start_time: '2020-12-04T08:54:27Z',
  //             timezone: 'America/Indianapolis',
  //             end_time: '2020-12-04T08:55:45Z',
  //             topic: 'CASpR Support',
  //             id: '98522741440',
  //             type: 1,
  //             uuid: 'JOeiPNgGSaGslOD6+uNLjQ==',
  //             host_id: 'eyxXfnupQvWNjXJcNoD7Xg'
  //           }
  //         }
  //       }
  //     */
  //   res.sendStatus(200);
  // });

  // this.app.post("/zoom", (req, res) => {
  //   console.log("POST ZOOM EVENT", req.body);
  // });

  // this.app.get("/zoom", async (req, res) => {
  //   console.log("ZOOM REQUEST", req.query);
  //   const { code, state } = req.query;
  //   if (code) {
  //     let userData;
  //     if (state) {
  //       userData = JSON.parse(
  //         Buffer.from(state as string, "base64").toString("utf-8")
  //       );
  //       console.log(userData);
  //     }

  //     let response = await axios.post("https://zoom.us/oauth/token", null, {
  //       params: {
  //         grant_type: "authorization_code",
  //         code: req.query.code,
  //         redirect_uri: process.env.ZOOM_REDIRECT_URI,
  //       },
  //       headers: {
  //         Authorization: `Basic ${Buffer.from(
  //           `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  //         ).toString("base64")}`,
  //       },
  //     } as AxiosRequestConfig);

  //     let token = jwt_decode<any>(response.data.access_token);
  //     if (userData) {
  //       session.addAuthorization(
  //         userData.teamId,
  //         userData.userId,
  //         response.data.access_token,
  //         token.uid
  //       );
  //       res.json(session.session(userData.teamId, userData.userId));
  //     } else {
  //       res.sendStatus(200);
  //     }
  //   } else {
  //     res.send(500);
  //   }
  // });
  //}
}
