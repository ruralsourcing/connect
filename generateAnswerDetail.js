const answerQuestionAsync = require('./answerQuestionAsync');

module.exports = async function generateAnswerDetail(payload) {
    var answer = await answerQuestionAsync(payload.text);
    console.log("Answer", answer);
    let message = {};
    message.as_user = true;
    message.token = payload.token;
    message.channel = payload.channel_id;
    message.text = "Answer";
    message.blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "QnA Maker Response Details"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `*Top Answer (${answer.answers[0].score}%)*`
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": ":thumbsup:",
                    "emoji": true,
                    "action_id": "top-answer"
                },
                "value": "top_choice"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": answer.answers[0].answer
            }
        },
        {
            "type": "divider"
        }
    ];
    if (answer.answers.length > 1) {
        message.blocks.push({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Other Answers*"
            }
        });
        for (var x = 1; x < answer.answers.length; x++) {
            message.blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${x}. *${answer.answers[x].questions[0]} (${answer.answers[x].score}%)*`
                }
            }, {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": answer.answers[x].answer
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": ":thumbsup:",
                            "emoji": true
                        },
                        "value": "option_" + x
                    }
                });
        }
    }
    return message;
}
