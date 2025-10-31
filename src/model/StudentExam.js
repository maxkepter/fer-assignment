class StudentExam {
  constructor(
    userId,
    examId,
    startDate,
    submitDate,
    status,
    scorce,
    examDetail,
    studentChoices
  ) {
    this.userId = userId;
    this.examId = examId;
    this.startDate = startDate;
    this.submitDate = submitDate;
    this.status = status;
    this.scorce = scorce;
    this.examDetail = examDetail;
    this.studentChoices = studentChoices;
  }
}
export default StudentExam;
