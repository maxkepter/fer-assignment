// Sample Exam creation using model classes
import Exam from "./model/Exam.js";
import Question from "./model/Question.js";
import Option from "./model/Option.js";
import { ExamService } from "./service/exam/ExamService.js";
import { StudentExamService } from "./service/exam/StudentExamService.js";

let examDetail = [
  {
    questionId: 1,
    questionContent: "Which keyword is used to define a class in Java?",
    options: [
      {
        optionId: 1,
        optionContent: "class",
        isCorrect: true,
      },
      {
        optionId: 2,
        optionContent: "struct",
        isCorrect: false,
      },
      {
        optionId: 3,
        optionContent: "define",
        isCorrect: false,
      },
    ],
  },
  {
    questionId: 2,
    questionContent: "What is the size of int in Java?",
    options: [
      {
        optionId: 4,
        optionContent: "2 bytes",
        isCorrect: false,
      },
      {
        optionId: 5,
        optionContent: "4 bytes",
        isCorrect: true,
      },
      {
        optionId: 6,
        optionContent: "8 bytes",
        isCorrect: false,
      },
    ],
  },
];

let studentExam = {
  studentChoices: [
    {
      questionId: 1,
      selectedOptions: [1],
    },
    {
      questionId: 2,
      selectedOptions: [5],
    },
  ],
  examDetail: examDetail,
};
console.log("Score:", StudentExamService.calculateScore(studentExam));
