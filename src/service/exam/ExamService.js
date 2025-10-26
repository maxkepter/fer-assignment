import axios from "axios";
import { SERVER_CONFIG } from "../../config/server.config.js";
function createExam(exam) {
  exam.status = "Active";
  axios
    .post(`${SERVER_CONFIG.CONTEXT_PATH}/exams`, exam)
    .then((res) => res.data);
}

function updateExam(examId, updatedExam) {
  axios
    .put(`${SERVER_CONFIG.CONTEXT_PATH}/exams/${examId}`, updatedExam)
    .then((res) => res.data);
}

function getAllExams() {
  return axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/exams`)
    .then((res) => res.data);
}

function getExamById(examId) {
  return axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/exams/${examId}`)
    .then((res) => res.data);
}

export const ExamService = {
  createExam,
};
