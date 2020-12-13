import SlackEventAdapter from "@slack/events-api/dist/adapter";
import { createEventAdapter } from "@slack/events-api";
import { EventEmitter } from "events";

export default function SlackEventHandlers(slackSigningSecret: string) {
  const slackEvents: SlackEventAdapter & EventEmitter = createEventAdapter(
    slackSigningSecret
  ) as any;

  slackEvents.on("message", (event) => {
    console.log(
      `Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
    );
  });

  slackEvents.on("url_verification", (event) => {
    return {
      challenge: event.challenge,
    };
  });

  /**
   * Fires when the app is mentioned in a channel. For mentions in a DM or private channel, use message.im or
   */
  slackEvents.on("app_mention", (event) => {
    console.log("app_mention", event);
  });

  slackEvents.on("message.groups", (event) => {
    console.log("message.groups", event);
  });

  slackEvents.on("message", (event) => {
    console.log("Message", event);
  });

  slackEvents.on("message.im", (event) => {
    console.log("message.im", event);
  });

  return slackEvents;
}
