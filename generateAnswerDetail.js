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
                    "emoji": true
                },
                "value": "top_choice",
                "action_id": "top-answer"
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
    return message;
}
