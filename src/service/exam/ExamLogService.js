import ExamLog from "../../model/ExamLog.js";
import axios from "axios";
import { SERVER_CONFIG } from "../../config/server.config.js";

function createLog(examLog) {
  return axios.post(`${SERVER_CONFIG.CONTEXT_PATH}/examLogs`, examLog);
}
function getLogsByStudentExamId(studentExamId) {
  return axios
    .get(
      `${SERVER_CONFIG.CONTEXT_PATH}/examLogs?studentExamId=${studentExamId}`
    )
    .then((response) => {
      return response.data;
    });
}
export const ExamLogService = {
  createLog,
  getLogsByStudentExamId,
};
