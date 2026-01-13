import { apiClient } from "./apiClient";

export const QUIZ_ENDPOINTS = {
  questions: "/quiz/questions/",
  submit: "/quiz/submit/",
};

export async function fetchQuizQuestions() {
  return await apiClient.get(QUIZ_ENDPOINTS.questions);
}

export async function submitQuizAnswers(answersArray) {
  return await apiClient.post(QUIZ_ENDPOINTS.submit, {
    body: { answers: answersArray },
  });
}
