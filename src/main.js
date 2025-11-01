// Sample Exam creation using model classes
import Exam from "./model/Exam.js";
import Question from "./model/Question.js";
import Option from "./model/Option.js";
import { ExamService } from "./service/exam/ExamService.js";
import { StudentExamService } from "./service/exam/StudentExamService.js";
import { UserService } from "./service/UserService.js";
import { ExamLogService } from "./service/exam/ExamLogService.js";
import ExamLog from "./model/ExamLog.js";

//test save progress with logs
let examId = "b36d";
let userId = "9929";

//Test submit exam
// StudentExamService.doExam(examId, userId).then(async ({ studentExam }) => {
//   // Simulate answering questions
//   let selectOption = [];
//   studentExam.examDetail.forEach((detail, index) => {
//     selectOption.push({
//       questionId: detail.questionId,
//       selectedOptionIds: [detail.options[0].optionId], // Select first option for all questions
//     });
//   });
//   studentExam.studentChoices = selectOption;
//   StudentExamService.saveProgress(
//     studentExam.id,
//     studentExam.studentChoices,
//     []
//   ).then(() => {
//     console.log("Progress saved before submission.");
//   });
//   let data = await StudentExamService.submitStudentExam(studentExam.id);
// });

//test submiit
let data = await StudentExamService.submitStudentExam("1f0a");
// console.log(data);
