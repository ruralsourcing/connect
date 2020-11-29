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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const events_api_1 = require("@slack/events-api");
const interactive_messages_1 = require("@slack/interactive-messages");
const web_api_1 = require("@slack/web-api");
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || '';
const token = process.env.SLACK_TOKEN || '';
console.log(token);
const port = process.env.PORT || 3000;
const slackEvents = events_api_1.createEventAdapter(slackSigningSecret);
const slackInteractions = interactive_messages_1.createMessageAdapter(slackSigningSecret);
const web = new web_api_1.WebClient(token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield web.auth.test();
    console.log("Done!");
}))();
const generateAnswerDetail = require("./generateAnswerDetail");
slackEvents.on("message", (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});
// Create an express application
const app = express_1.default();
app.use("/interact", slackInteractions.expressMiddleware());
slackEvents.on("url_verification", (event) => {
    return {
        challenge: event.challenge,
    };
});
slackEvents.on("app_mention", (event) => { });
// Plug the adapter in as a middleware
app.use("/events", slackEvents.expressMiddleware());
// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
app.use(express_1.default.json()); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post("/slash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let message = yield generateAnswerDetail(req.body);
    res.json(message);
}));
app.get("/ping", (_, res) => {
    res.send({
        message: "pong!",
    });
});
// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = http_1.createServer(app);
server.listen(port, () => {
    // Log a message when the server is ready
    console.log(`Listening for events on ${port}`);
});
// Example of handling all message actions
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
