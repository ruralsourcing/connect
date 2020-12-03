import { answerQuestionAsync } from "./answerQuestionAsync";
import { WebAPICallResult } from '@slack/web-api';
import { Block, DividerBlock, SectionBlock } from '@slack/types';

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
        } as SectionBlock,
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
        } as SectionBlock,
        {
          type: "divider",
        } as DividerBlock,
      ]
    } as QnAMessageResult;
  };
};
