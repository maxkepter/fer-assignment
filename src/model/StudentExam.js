class StudentExam {
  constructor(
    userId,
    exam,
    startDate,
    submitDate,
    status,
    scorce,
    examDetail,
    studentChoices
  ) {
    this.userId = userId;
    this.exam = exam;
    this.startDate = startDate;
    this.submitDate = submitDate;
    this.status = status;
    this.scorce = scorce;
    this.examDetail = examDetail;
    this.studentChoices = studentChoices;
  }
}
export default StudentExam;
