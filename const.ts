import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";
import { QnAMakerRuntimeClient } from "@azure/cognitiveservices-qnamaker-runtime";

export const QNAMAKER_KEY = process.env["QNAMAKER_KEY"] || "<QNAMAKER_KEY>";
export const QNAMAKER_ENDPOINT =
  process.env["QNAMAKER_ENDPOINT"] || "<QNAMAKER_ENDPOINT>";
export const kbid =
  process.env["QNAMAKER_KNOWLEDGE_BASE_ID"] || "<QNAMAKER_KNOWLEDGE_BASE_ID>";
export const cognitiveServicesCredentials = new CognitiveServicesCredentials(
  QNAMAKER_KEY
);
export const client = new QnAMakerRuntimeClient(
  cognitiveServicesCredentials,
  QNAMAKER_ENDPOINT
);
export const customHeaders = { Authorization: `EndpointKey ${QNAMAKER_KEY}` };
