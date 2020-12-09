"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interactive_messages_1 = require("@slack/interactive-messages");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const axios_1 = __importDefault(require("axios"));
function SlackInteractionHandlers(slackSigningSecret, session, meetingManager) {
    const slackInteractions = interactive_messages_1.createMessageAdapter(slackSigningSecret);
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
    slackInteractions.action({ actionId: "zoom" }, (payload, respond) => __awaiter(this, void 0, void 0, function* () {
        // Logs the contents of the action to the console
        let userSession = session.session(payload.user.team_id, payload.user.id);
        if (userSession === null || userSession === void 0 ? void 0 : userSession.authorization) {
            let token = jwt_decode_1.default(userSession.authorization.token);
            let response = yield axios_1.default.post(`https://api.zoom.us/v2/users/${token.uid}/meetings`, {
                type: 1,
                topic: "CASpR Support",
                agenda: "Understanding the reducer pattern in React",
            }, {
                headers: {
                    Authorization: `Bearer ${userSession.authorization.token}`,
                },
            });
            // SEND DM to users
            console.log(response.data);
            meetingManager.addMeeting(response.data);
            respond({
                text: `<${response.data.start_url}|Click here to start your meeting: ${response.data.topic}: ${response.data.agenda}>`,
                response_type: "ephemeral",
            });
        }
        else {
            respond({
                text: `Hold up, it looks like we need to let Zoom create meetings for you. <https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${process.env.ZOOM_REDIRECT_URI}&state=${Buffer.from(JSON.stringify({
                    teamId: payload.user.team_id,
                    userId: payload.user.id,
                })).toString("base64")}|Connect Zoom>`,
                response_type: "ephemeral",
            });
        }
    }));
    return slackInteractions;
}
exports.default = SlackInteractionHandlers;
