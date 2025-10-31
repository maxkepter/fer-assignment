import ExamLog from "../../model/ExamLog.js";
import axios from "axios";
import { SERVER_CONFIG } from "../../config/server.config.js";
function createLog(studentExamId, action, detail) {
  let examLog = new ExamLog(studentExamId, new Date(), action, detail);
  axios.post(`${SERVER_CONFIG.CONTEXT_PATH}/examLogs`, examLog);
}
export const ExamLogService = {
  createLog,
};
