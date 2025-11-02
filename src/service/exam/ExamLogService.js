import ExamLog from "../../model/ExamLog.js";
import axios from "axios";
import { SERVER_CONFIG } from "../../config/server.config.js";

async function createLog(examLog, maxRetry = 3) {
  for (let attempt = 1; attempt <= maxRetry; attempt++) {
    try {
      const res = await axios.post(
        `${SERVER_CONFIG.CONTEXT_PATH}/examLogs`,
        examLog
      );
      console.log(`[LOG OK] ${examLog.action} (attempt ${attempt})`);
      return res.data;
    } catch (error) {
      console.warn(`[LOG FAIL] attempt ${attempt}:`, error.message);
      if (attempt === maxRetry) throw error;
      await new Promise((r) => setTimeout(r, 500 * attempt)); // backoff retry
    }
  }
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
