// For answering questions, we should use the qnamaker runtime instead of the knowledgebase API's
// https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker-runtime/v/1.0.1

import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";
import { QnAMakerRuntimeClient, QnAMakerRuntimeModels } from "@azure/cognitiveservices-qnamaker-runtime";

const QNAMAKER_KEY = process.env["QNAMAKER_KEY"] || "<QNAMAKER_KEY>";
const QNAMAKER_ENDPOINT =
  process.env["QNAMAKER_ENDPOINT"] || "<QNAMAKER_ENDPOINT>";
const kbid =
  process.env["QNAMAKER_KNOWLEDGE_BASE_ID"] || "<QNAMAKER_KNOWLEDGE_BASE_ID>";
const cognitiveServicesCredentials = new CognitiveServicesCredentials(
  QNAMAKER_KEY
);
const client = new QnAMakerRuntimeClient(
  cognitiveServicesCredentials,
  QNAMAKER_ENDPOINT
);
const customHeaders = { Authorization: `EndpointKey ${QNAMAKER_KEY}` };

export async function answerQuestionAsync(
  question: string
): Promise<QnAMakerRuntimeModels.QnASearchResult[] | void> {
  const top = 10;
  const result = await client.runtime.generateAnswer(
    kbid,
    { question, top },
    { customHeaders }
  );
  return result.answers;
}
