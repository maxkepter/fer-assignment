import axios from "axios";
import { SERVER_CONFIG } from "../../config/server.config.js";
function createExam(exam) {
  exam.status = "Active";
  let data = { success: true, exam: exam };
  axios
    .post(`${SERVER_CONFIG.CONTEXT_PATH}/exams`, exam)
    .then((res) => res.data)
    .catch((error) => {
      data = { success: false, message: error.message };
    });
  return data;
}

function updateExam(examId, updatedExam) {
  let data = { success: true, exam: updatedExam };
  axios
    .put(`${SERVER_CONFIG.CONTEXT_PATH}/exams/${examId}`, updatedExam)
    .then((res) => res.data)
    .catch((error) => {
      data = { success: false, message: error.message };
    });
  return data;
}

function deleteExam(examId) {
  return axios
    .delete(`${SERVER_CONFIG.CONTEXT_PATH}/exams/${examId}`)
    .then((res) => res.data);
}

async function getAllExams() {
  return await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/exams`)
    .then((res) => res.data);
}

async function getExamById(examId) {
  return await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/exams/${examId}`)
    .then((res) => res.data);
}

export const ExamService = {
  createExam,
  updateExam,
  getAllExams,
  getExamById,
  deleteExam,
};
