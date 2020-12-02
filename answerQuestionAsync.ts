// For answering questions, we should use the qnamaker runtime instead of the knowledgebase API's
// https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker-runtime/v/1.0.1

import {
  QnAMakerRuntimeModels,
} from "@azure/cognitiveservices-qnamaker-runtime";
import { client, kbid, customHeaders } from './const';

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
