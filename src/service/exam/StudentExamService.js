import axios from "axios";
import StudentExam from "../../model/StudentExam.js";
import { ArrayUtils } from "../../utils/ArrayUtils.js";
import { SERVER_CONFIG } from "../../config/server.config.js";
import { ExamLogService } from "./ExamLogService.js";

function createStudentExam(exam, user) {
  let examDetails = ArrayUtils.mixArray(exam.questions);

  let studentExam = new StudentExam(
    user.id,
    exam.id,
    new Date(),
    null,
    "In Progress",
    0,
    examDetails,
    []
  );

  axios
    .post(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams`, studentExam)
    .then((res) => {
      studentExam = res.data;
    })
    .then(() => {
      ExamLogService.createLog(
        studentExam.id,
        "CREATE",
        `Student exam created for user ID: ${user.id} and exam ID: ${exam.id}`
      );
    })
    .catch((error) => {
      throw new Error("Error creating student exam: " + error.message);
    });

  return studentExam;
}

function updateStudentChoices(studentExamId, studentChoices) {
  axios
    .put(
      `${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}/studentChoice`,
      studentChoices
    )
    .then(() => {
      ExamLogService.createLog(
        studentExamId,
        studentChoices.isRemove ? "REMOVE_CHOICE" : "CHOICE",
        studentChoices.isRemove
          ? `Student choice removed for question ID: ${studentChoices.questionId}`
          : `Student choice updated for question ID: ${studentChoices.questionId}`
      );
    })
    .catch((error) => {
      throw new Error("Error updating student choices: " + error.message);
    });
}

function submitStudentExam(studentExamId) {
  let data;
  let studentExam = getStudentExamById(studentExamId);
  let score = calculateScore(studentExam);
  studentExam.score = score;
  studentExam.status = "Submitted";
  studentExam.submitDate = new Date();
  data = { success: true, studentExam: studentExam };
  axios
    .put(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`, {
      ...studentExam,
    })
    .then(() => {
      ExamLogService.createLog(studentExam.id, "SUBMIT", `Exam submitted`);
    })
    .catch((error) => {
      console.error("Error submitting student exam:", error);
      data = { success: false, message: error.message };
    });
  return data;
}

async function getAllStudentExams() {
  let data = await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams`)
    .then((response) => response.data);
  return data;
}

async function getStudentExamByUserId(userId) {
  let data = await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams/userId/${userId}`)
    .then((response) => response.data);
  return data;
}

async function getStudentExamById(studentExamId) {
  let data = await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`)
    .then((response) => response.data);
  return data;
}

function calculateScore(studentExam) {
  let studentChoices = studentExam.studentChoices;
  if (!studentChoices || studentChoices.length === 0) {
    return 0;
  }
  let correctCount = 0;
  let correctAnswers = getCorrectAnswers(studentExam.examDetail);
  console.log("Student Choices in Score Calculation:", studentChoices);
  console.log("Correct Answers in Score Calculation:", correctAnswers);
  correctAnswers.forEach((answer) => {
    let studentAnswer = studentChoices.find(
      (choice) => choice.questionId === answer.questionId
    );
    if (studentAnswer) {
      let isCorrect =
        JSON.stringify(answer.correctOptions.sort()) ===
        JSON.stringify(studentAnswer.selectedOptions.sort());
      if (isCorrect) {
        correctCount++;
      }
    }
  });
  let score = (correctCount / correctAnswers.length) * 100;
  return score;
}
function getCorrectAnswers(examDetail) {
  return examDetail.map((question) => {
    let correctAnswers = {
      questionId: question.questionId,
      correctOptions: question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.optionId),
    };
    return correctAnswers;
  });
}

export const StudentExamService = {
  createStudentExam,
  updateStudentChoices,
  submitStudentExam,
  getAllStudentExams,
  getStudentExamByUserId,
  getStudentExamById,
  calculateScore,
  getCorrectAnswers,
};
