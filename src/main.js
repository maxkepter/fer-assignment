// Sample Exam creation using model classes
import Exam from "./model/Exam.js";
import Question from "./model/Question.js";
import Option from "./model/Option.js";
import { ExamService } from "./service/exam/ExamService.js";

// Build a small sample exam with two questions
const q1Options = [
  new Option("2", false),
  new Option("3", true),
  new Option("4", false),
  new Option("5", false),
];

const q2Options = [
  new Option("Paris", true),
  new Option("London", false),
  new Option("Berlin", false),
  new Option("Rome", false),
];

const questions = [
  new Question("What is 1 + 2?", q1Options),
  new Question("What is the capital of France?", q2Options),
];

export const sampleExam = new Exam(
  "Sample General Knowledge Exam",
  "Scheduled", // examStatus
  30, // duration in minutes
  new Date("2025-11-01T09:00:00Z"), // startDate
  new Date("2025-11-01T09:30:00Z"), // endDate
  questions
);

console.log("Sample Exam:", sampleExam);
ExamService.createExam(sampleExam);
