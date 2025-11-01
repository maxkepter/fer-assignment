import axios from "axios";
import StudentExam from "../../model/StudentExam.js";
import { ArrayUtils } from "../../utils/ArrayUtils.js";
import { SERVER_CONFIG } from "../../config/server.config.js";
import { ExamLogService } from "./ExamLogService.js";
import { ExamService } from "./ExamService.js";
import { UserService } from "../UserService.js";
import ExamLog from "../../model/ExamLog.js";

function doExam(examId, userId) {
  return getDoingExam(userId)
    .then((doingExam) => {
      if (doingExam && doingExam.length > 0) {
        // If there's an ongoing exam, return it
        return { isDoingExam: true, studentExam: doingExam[0] };
      }
      // No ongoing exam, create a new one
      return createStudentExam(examId, userId).then((newExam) => ({
        isDoingExam: false,
        studentExam: newExam,
      }));
    })
    .catch((error) => {
      console.error("Error while processing exam:", error);
      throw new Error("Error while processing exam: " + error.message);
    });
}
async function createStudentExam(examId, userId) {
  try {
    // Fetch user and exam details in parallel
    const [exam, user] = await Promise.all([
      ExamService.getExamById(examId),
      UserService.getUserById(userId),
    ]);

    if (!exam) {
      throw new Error("Exam not found with ID: " + examId);
    }
    if (!user) {
      throw new Error("User not found with ID: " + userId);
    }

    // Mix questions and options
    const examDetails = ArrayUtils.mixArray(exam.questions)
      .slice(0, Number.parseInt(exam.numberQuestion))
      .map((question) => {
        question.options = ArrayUtils.mixArray(question.options);
        return question;
      });

    console.log("Number of questions selected:", examDetails.length);
    console.log("Number of questions in exam:", exam.numberQuestion);

    // Create StudentExam instance
    const studentExam = new StudentExam(
      user.id,
      { id: exam.id, name: exam.examName, duration: exam.duration },
      new Date(),
      null,
      "In Progress",
      0,
      examDetails,
      []
    );

    // Save to server
    const res = await axios.post(
      `${SERVER_CONFIG.CONTEXT_PATH}/studentExams`,
      studentExam
    );

    const createdExam = res.data;
    // console.log("Student exam created:", createdExam);
    // Create log entry
    await ExamLogService.createLog(
      new ExamLog(
        createdExam.id,
        new Date(),
        "CREATE",
        `Student exam created for user ID: ${user.id} and exam ID: ${exam.id}`
      )
    )
      .then(() => {
        console.log("Exam creation log recorded.");
      })
      .catch((error) => {
        console.error("Error recording exam creation log:", error);
      });

    return createdExam;
  } catch (error) {
    throw new Error("Error creating student exam: " + error.message);
  }
}

function saveProgress(studentExamId, studentChoices, selectLog) {
  return axios
    .patch(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`, {
      studentChoices: studentChoices,
    })
    .then(() => {
      selectLog.forEach((log) => {
        ExamLogService.createLog(log);
      });
    })
    .catch((error) => {
      throw new Error("Error updating student choices: " + error.message);
    });
}

async function submitStudentExam(studentExamId) {
  let data;
  let studentExam = await getStudentExamById(studentExamId);
  let score = calculateScore(studentExam);
  studentExam.score = score;
  studentExam.status = "Submitted";
  studentExam.submitDate = new Date();
  data = { success: true, studentExam: studentExam };
  axios
    .patch(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`, {
      score: score,
      status: "Submitted",
      submitDate: studentExam.submitDate,
    })
    .then(() => {
      ExamLogService.createLog(
        new ExamLog(
          studentExam.id,
          new Date(),
          "SUBMIT",
          `Student exam submitted with score: ${studentExam.score}`
        )
      );
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
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams?userId=${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(
        "Error fetching student exams by user ID: " + error.message
      );
    });
  return data;
}

async function getStudentExamByExamId(examId) {
  let data = await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(
        "Error fetching student exams by exam ID: " + error.message
      );
    });

  return data.filter((se) => se.exam.id === examId);
}

async function getStudentExamWithParams(params) {
  let queryString = new URLSearchParams(params).toString();
  let data = await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams?${queryString}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(
        "Error fetching student exams with params: " + error.message
      );
    });
  return data;
}

function getStudentExamById(studentExamId) {
  return axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`)
    .then((response) => response.data);
}

function calculateScore(studentExam) {
  let studentChoices = studentExam.studentChoices;
  if (!studentChoices || studentChoices.length === 0) {
    return 0;
  }
  let correctCount = 0;
  let correctAnswers = getCorrectAnswers(studentExam.examDetail);
  correctAnswers.forEach((answer) => {
    let studentAnswer = studentChoices.find(
      (choice) => choice.questionId === answer.questionId
    );
    if (studentAnswer) {
      let isCorrect =
        JSON.stringify(answer.correctOptions.sort()) ===
        JSON.stringify(studentAnswer.selectedOptionIds.sort());
      if (isCorrect) {
        correctCount++;
      }
    }
  });
  let score = (correctCount / correctAnswers.length) * 100;

  score = Math.round(score * 100) / 100; // Round to 2 decimal places

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

async function getDoingExam(userId) {
  let studentExam = await getStudentExamWithParams({
    userId: userId,
    status: "In Progress",
  });
  return studentExam;
}

export const StudentExamService = {
  createStudentExam,
  saveProgress,
  submitStudentExam,
  getAllStudentExams,
  getStudentExamByUserId,
  getStudentExamById,
  calculateScore,
  getCorrectAnswers,
  getStudentExamWithParams,
  doExam,
  getStudentExamByExamId,
};
