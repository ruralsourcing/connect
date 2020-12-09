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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnswerDetail = void 0;
const answerQuestionAsync_1 = require("./answerQuestionAsync");
function generateAnswerDetail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var answers = yield answerQuestionAsync_1.answerQuestionAsync(payload.text);
        if (answers) {
            return {
                token: payload.token,
                channel: payload.channel_id,
                text: "Answer",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `${answers[0].answer} (${answers[0].score}%)*`,
                        },
                        accessory: {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: ":thumbsup:",
                                emoji: true,
                            },
                            action_id: "top-answer",
                        },
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "Hop on a zoom call?",
                        },
                        accessory: {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: ":ghost:",
                                emoji: true,
                            },
                            action_id: "zoom",
                        },
                    },
                    {
                        type: "divider",
                    },
                ]
            };
        }
        ;
    });
}
exports.generateAnswerDetail = generateAnswerDetail;
;
