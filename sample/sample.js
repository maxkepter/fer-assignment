const fs = require("fs");

function generateExamData() {
  const exam = {
    id: "b2d5",
    examName: "Sample Exam",
    examStatus: "ACTIVE",
    duration: "4",
    numberQuestion: "60",
    questions: [],
    status: "Active",
  };

  for (let i = 1; i <= 200; i++) {
    const questionId = Date.now() + i;
    const correctIndex = Math.floor(Math.random() * 3);

    const question = {
      questionId,
      questionContent: `Question ${i}: Sample question content ${i}?`,
      options: [],
    };

    for (let j = 0; j < 3; j++) {
      question.options.push({
        optionId: questionId * 10 + j,
        optionContent: `Option ${j + 1} for question ${i}`,
        isCorrect: j === correctIndex,
      });
    }

    exam.questions.push(question);
  }

  return { exams: [exam] };
}

// Tạo dữ liệu
const examData = generateExamData();

// Ghi ra file JSON
fs.writeFileSync("examData.json", JSON.stringify(examData, null, 2));

console.log("✅ examData.json has been generated successfully!");
