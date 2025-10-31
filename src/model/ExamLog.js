class ExamLog {
  constructor(studentExamId, timestamp, action, detail) {
    this.studentExamId = studentExamId;
    this.timestamp = timestamp;
    this.action = action;
    this.detail = detail;
  }
}
export default ExamLog;
