import { answerQuestionAsync } from "./answerQuestionAsync";
import { WebAPICallResult } from '@slack/web-api';
import { Block, SectionBlock } from '@slack/types';

interface QnAMessageResult extends WebAPICallResult {
    channel: string;
    token: string;
    text: string;
    message: {
      text: string;
    }
    blocks: Block[]
  }

export async function generateAnswerDetail(payload: any): Promise<QnAMessageResult | void> {
  var answers = await answerQuestionAsync(payload.text);
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
            text: "QnA Maker Response Details",
          },
        } as SectionBlock,
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Top Answer (${answers[0].score}%)*`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: ":thumbsup:",
              emoji: true,
            },
            value: "top_choice",
            action_id: "top-answer",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: answers[0].answer,
          },
        },
        {
          type: "divider",
        },
      ]
    } as QnAMessageResult;
  };
};
