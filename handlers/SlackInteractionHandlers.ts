import { createMessageAdapter } from "@slack/interactive-messages";
import { EventEmitter } from "events";
import SlackMessageAdapter from "@slack/interactive-messages/dist/adapter";
import SessionManager from "../lib/SessionManager/SessionManager";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default function SlackInteractionHandlers(
  slackSigningSecret: string,
  session: SessionManager
) {
  const slackInteractions: SlackMessageAdapter &
    EventEmitter = createMessageAdapter(slackSigningSecret) as any;

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

  slackInteractions.action({ actionId: "zoom" }, async (payload, respond) => {
    // Logs the contents of the action to the console
    let userSession = session.session(payload.user.team_id, payload.user.id);
    if (userSession?.authorization) {
      let token = jwt_decode<any>(userSession.authorization.token);
      let response = await axios.post(
        `https://api.zoom.us/v2/users/${token.uid}/meetings`,
        {
          type: 1,
          topic: "CASpR Support",
          agenda: "Understanding the reducer pattern in React",
        },
        {
          headers: {
            Authorization: `Bearer ${userSession.authorization.token}`,
          },
        }
      );
      // SEND DM to users
      console.log(response.data);
      respond({
        text: `<${response.data.start_url}|Click here to start your meeting: ${response.data.topic}: ${response.data.agenda}>`,
        response_type: "ephemeral",
      });
    } else {
      respond({
        text: `Hold up, it looks like we need to let Zoom create meetings for you. <https://zoom.us/oauth/authorize?response_type=code&client_id=${
          process.env.ZOOM_CLIENT_ID
        }&redirect_uri=${process.env.ZOOM_REDIRECT_URI}&state=${Buffer.from(
          JSON.stringify({
            teamId: payload.user.team_id,
            userId: payload.user.id,
          })
        ).toString("base64")}|Connect Zoom>`,
        response_type: "ephemeral",
      });
    }
  });
  return slackInteractions;
}
