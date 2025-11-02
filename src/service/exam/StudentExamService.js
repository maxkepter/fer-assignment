import axios from "axios";
import StudentExam from "../../model/StudentExam.js";
import { ArrayUtils } from "../../utils/ArrayUtils.js";
import { SERVER_CONFIG } from "../../config/server.config.js";
import { ExamLogService } from "./ExamLogService.js";
import { ExamService } from "./ExamService.js";
import { UserService } from "../UserService.js";
import ExamLog from "../../model/ExamLog.js";
// ==============================
// MAIN SERVICE
// ==============================

async function doExam(examId, userId) {
  try {
    const doingExam = await getDoingExam(userId);
    if (doingExam && doingExam.length > 0) {
      return { isDoingExam: true, studentExam: doingExam[0] };
    }

    const newExam = await createStudentExam(examId, userId);
    return { isDoingExam: false, studentExam: newExam };
  } catch (error) {
    console.error("Error while processing exam:", error);
    throw new Error("Error while processing exam: " + error.message);
  }
}

async function createStudentExam(examId, userId) {
  try {
    const [exam, user] = await Promise.all([
      ExamService.getExamById(examId),
      UserService.getUserById(userId),
    ]);

    if (!exam) throw new Error("Exam not found with ID: " + examId);
    if (!user) throw new Error("User not found with ID: " + userId);

    const examDetails = ArrayUtils.mixArray(exam.questions)
      .slice(0, Number.parseInt(exam.numberQuestion))
      .map((q) => ({
        ...q,
        options: ArrayUtils.mixArray(q.options),
      }));

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

    const res = await axios.post(
      `${SERVER_CONFIG.CONTEXT_PATH}/studentExams`,
      studentExam
    );
    const createdExam = res.data;

    // Ghi log sau khi tạo xong
    await ExamLogService.createLog(
      new ExamLog(
        createdExam.id,
        new Date(),
        "CREATE",
        `Student exam created for user ID: ${user.id} and exam ID: ${exam.id}`
      )
    );

    return createdExam;
  } catch (error) {
    throw new Error("Error creating student exam: " + error.message);
  }
}

async function saveProgress(studentExamId, studentChoices, selectLog) {
  try {
    await axios.patch(
      `${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`,
      {
        studentChoices,
      }
    );

    // Record progress logs if any
    if (selectLog && selectLog.length > 0) {
      for (const log of selectLog) {
        await ExamLogService.createLog(log);
      }
      console.log("Progress logs recorded:", selectLog.length);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating student choices:", error);
    throw new Error("Error updating student choices: " + error.message);
  }
}

async function submitStudentExam(studentExamId) {
  try {
    let studentExam = await getStudentExamById(studentExamId);
    let score = calculateScore(studentExam);

    studentExam = {
      ...studentExam,
      score,
      status: "Submitted",
      submitDate: new Date(),
    };

    const res = await axios.patch(
      `${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`,
      {
        score,
        status: "Submitted",
        submitDate: studentExam.submitDate,
      }
    );

    studentExam = res.data;

    // Record submission log
    await ExamLogService.createLog(
      new ExamLog(
        studentExam.id,
        new Date(),
        "SUBMIT",
        `Student exam submitted with score: ${studentExam.score}`
      )
    );

    return { success: true, studentExam };
  } catch (error) {
    console.error("Error submitting student exam:", error);
    return { success: false, message: error.message };
  }
}

// ==============================
// FETCH + UTILS
// ==============================

async function getAllStudentExams() {
  const res = await axios.get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams`);
  return res.data;
}

async function getStudentExamByUserId(userId) {
  try {
    const res = await axios.get(
      `${SERVER_CONFIG.CONTEXT_PATH}/studentExams?userId=${userId}`
    );
    return res.data;
  } catch (error) {
    throw new Error(
      "Error fetching student exams by user ID: " + error.message
    );
  }
}

async function getStudentExamByExamId(examId) {
  try {
    const res = await axios.get(`${SERVER_CONFIG.CONTEXT_PATH}/studentExams`);
    return res.data.filter((se) => se.exam.id === examId);
  } catch (error) {
    throw new Error(
      "Error fetching student exams by exam ID: " + error.message
    );
  }
}

async function getStudentExamWithParams(params) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await axios.get(
      `${SERVER_CONFIG.CONTEXT_PATH}/studentExams?${queryString}`
    );
    return res.data;
  } catch (error) {
    throw new Error(
      "Error fetching student exams with params: " + error.message
    );
  }
}

async function getStudentExamById(studentExamId) {
  const res = await axios.get(
    `${SERVER_CONFIG.CONTEXT_PATH}/studentExams/${studentExamId}`
  );
  return res.data;
}

function calculateScore(studentExam) {
  const studentChoices = studentExam.studentChoices || [];
  if (studentChoices.length === 0) return 0;

  let correctCount = 0;
  const correctAnswers = getCorrectAnswers(studentExam.examDetail);

  correctAnswers.forEach((answer) => {
    const studentAnswer = studentChoices.find(
      (choice) => choice.questionId === answer.questionId
    );
    if (studentAnswer) {
      const isCorrect =
        JSON.stringify(answer.correctOptions.sort()) ===
        JSON.stringify(studentAnswer.selectedOptionIds.sort());
      if (isCorrect) correctCount++;
    }
  });

  const score =
    Math.round((correctCount / correctAnswers.length) * 10000) / 100;
  return score;
}

function getCorrectAnswers(examDetail) {
  return examDetail.map((question) => ({
    questionId: question.questionId,
    correctOptions: question.options
      .filter((option) => option.isCorrect)
      .map((option) => option.optionId),
  }));
}

async function getDoingExam(userId) {
  const studentExam = await getStudentExamWithParams({
    userId,
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
