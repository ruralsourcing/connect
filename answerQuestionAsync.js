var axios = require("axios");

/**
 * @param {string} question The question to ask
 * @return {object} QnA Pair Object
 * @see
 */
module.exports = async function answerQuestionAsync(question) {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url:
        "https://casprqna.azurewebsites.net/qnamaker/knowledgebases/471b9e16-980d-4aa2-88d1-75bbc92d3754/generateAnswer",
      headers: {
        "cache-control": "no-cache",
        "Content-Type": "application/json",
        Authorization: "EndpointKey 711a0e98-4534-4211-9866-2ee983c1192f",
      },
      data: { question: question, top: 10 },
    })
      .then(function (response) {
        console.log(response.data);
        resolve(response.data);
      })
      .catch(reject);
  });
};
