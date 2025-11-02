import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import { StudentExamService } from "../../../service/exam/StudentExamService";
import ExamLog from "../../../model/ExamLog";
import { Button, Modal } from "react-bootstrap";
import SubmitConfirmModal from "../../modal/SubmitConfirmModal";
import { ResultModal } from "../../modal/ResultModal";

export const DoExam = () => {
  const { user } = useContext(UserContext);
  const { examId } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [studentExam, setStudentExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [showSubmit, setShowSubmit] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const timerRef = useRef();
  const [selectLog, setSelectLog] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (user && examId && !hasRedirected) handleStartExam();
  }, [user, examId, hasRedirected]);

  useEffect(() => {
    if (!studentExam) return;
    const interval = setInterval(() => {
      sendProgress();
    }, 30 * 1000); // every 30 seconds
    return () => clearInterval(interval);
  }, [studentExam, answers, selectLog]);

  function handleStartExam() {
    setLoading(true);
    StudentExamService.doExam(examId, user.id)
      .then(({ isDoingExam, studentExam }) => {
        if (isDoingExam && studentExam.exam.id !== examId) {
          console.log(studentExam);
          alert(
            `You have an ongoing exam (ID: ${studentExam.exam.id}). Redirecting...`
          );
          setHasRedirected(true);
          navigate(`/exam/do/${studentExam.exam.id}`);
        }
        setStudentExam(studentExam);
        const startTime = new Date(studentExam.startDate).getTime();
        const now = Date.now();
        const durationMs = Number(studentExam.exam.duration) * 60 * 1000;
        const elapsedMs = now - startTime;
        const remaining = Math.max(
          0,
          Math.floor((durationMs - elapsedMs) / 1000)
        );
        setTimeLeft(remaining);

        if (
          studentExam.studentChoices &&
          studentExam.studentChoices.length > 0
        ) {
          const restoredAnswers = studentExam.studentChoices.reduce(
            (acc, choice) => {
              acc[choice.questionId] = choice.selectedOptionIds;
              return acc;
            },
            {}
          );

          setAnswers(restoredAnswers);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function isOptionSelected(qId, optId) {
    return answers[qId]?.includes(optId);
  }

  async function sendProgress() {
    if (!studentExam) return;

    const studentChoices = Object.entries(answers).map(([qId, optionIds]) => ({
      questionId: Number.parseInt(qId),
      selectedOptionIds: optionIds,
    }));

    await StudentExamService.saveProgress(
      studentExam.id,
      studentChoices,
      selectLog
    )
      .then(() => {
        console.log("Progress saved.", studentChoices, selectLog);
        setSelectLog([]);
      })
      .catch((err) => {
        console.error("Error saving progress:", err);
      });
  }

  // Timer effect
  useEffect(() => {
    if (isFinished || !studentExam) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          alert("Hết giờ! Tự động nộp bài.");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [studentExam]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  function handleSelect(qId, optId) {
    let isSelect = isOptionSelected(qId, optId);

    setSelectLog((prev) => [
      ...prev,
      new ExamLog(
        studentExam.id,
        new Date(),
        !isSelect ? "Select Option" : "Deselect Option",
        isSelect
          ? `Deselected option ID: ${optId} for question ID: ${qId}`
          : `Selected option ID: ${optId} for question ID: ${qId}`
      ),
    ]);

    setAnswers((prev) => {
      const current = prev[qId] || [];
      const updated = isSelect
        ? current.filter((id) => id !== optId)
        : [...current, optId];
      return { ...prev, [qId]: updated };
    });
  }

  function isOptionSelected(qId, optId) {
    return answers[qId]?.includes(optId);
  }

  const toggleFlag = (qId) =>
    setFlagged((p) => {
      const n = new Set(p);
      n.has(qId) ? n.delete(qId) : n.add(qId);
      return n;
    });

  async function handleSubmit() {
    try {
      await sendProgress();
      const data = await StudentExamService.submitStudentExam(studentExam.id);
      console.log(data);
      setShowSubmit(false);

      if (data?.success) {
        setStudentExam(data.studentExam);
        setIsFinished(true);
        setResultModal(true);
      } else {
        alert("Error submitting exam: " + (data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Unexpected error in handleSubmit:", err);
      alert("An unexpected error occurred while submitting the exam.");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!studentExam) return <div>No exam data available.</div>;

  const total = studentExam.examDetail.length;
  const answered = Object.values(answers).filter(
    (arr) => arr && arr.length > 0
  ).length;

  return (
    <div
      className="do-exam-page"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <style>{`
        .gradient-bg{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
        .question-card{border:none;box-shadow:0 2px 6px rgba(0,0,0,0.1);padding:1rem;margin-bottom:1rem;border-radius:10px;background:white}
        .option-label{display:block;padding:10px 14px;border:2px solid #e9ecef;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:.2s}
        .option-label:hover{border-color:#667eea;background:#f8f9ff}
        .option-label.selected{border-color:#667eea;background:#667eea;color:white}
        .progress-custom{height:8px;border-radius:4px}
        .flag-btn{border:none;background:none;color:#ffc107;font-size:18px}
        .sidebar{position:fixed;right:0;top:0;height:100vh;width:240px;background:white;box-shadow:-2px 0 5px rgba(0,0,0,0.1);padding:1rem;overflow-y:auto}
        .sidebar h6{font-weight:600;margin-bottom:1rem}
        .question-num{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:4px;cursor:pointer;font-weight:500;transition:0.2s}
        .question-num.unanswered{background:#e9ecef;color:#495057}
        .question-num.answered{background:#198754;color:white}
        .question-num.flagged{background:#ffc107;color:white}
        .question-num:hover{transform:scale(1.1)}
        @media(max-width:992px){.sidebar{display:none}}
      `}</style>

      {/* MAIN */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-10">
            <div className="container py-3">
              {studentExam.examDetail.map((q, idx) => (
                <div
                  key={q.questionId}
                  id={`question-${idx}`}
                  className="question-card"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">
                      Question {idx + 1}: {q.questionContent}
                    </h6>
                    <button
                      className="flag-btn"
                      onClick={() => toggleFlag(q.questionId)}
                    >
                      {flagged.has(q.questionId) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          class="bi bi-bookmark-check-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          class="bi bi-bookmark"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {q.options.map((opt) => {
                    const selected = isOptionSelected(
                      q.questionId,
                      opt.optionId
                    );
                    return (
                      <label
                        key={opt.optionId}
                        className={`option-label ${selected ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() =>
                            handleSelect(q.questionId, opt.optionId)
                          }
                          hidden
                        />

                        {opt.optionContent}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-lg-3">
            <div className="sidebar pt-3 gradient-bg ">
              <div>
                <h5 className="fw-bold mb-0">Exam : {studentExam.exam.name}</h5>
              </div>
              <div className="d-flex align-items-center gap-3">
                <strong
                  className={timeLeft <= 60 ? "text-danger" : "text-dark"}
                >
                  Time Left: {formatTime(timeLeft)}
                </strong>
              </div>
              <hr />
              <h6>Question List</h6>
              <div className="d-flex flex-wrap">
                {studentExam.examDetail.map((q, idx) => {
                  const hasAns = answers[q.questionId]?.length > 0;
                  const isFlagged = flagged.has(q.questionId);
                  let cls = "unanswered";
                  if (isFlagged) cls = "flagged";
                  else if (hasAns) cls = "answered";
                  return (
                    <div
                      key={q.questionId}
                      className={`question-num ${cls}`}
                      onClick={() => {
                        document
                          .getElementById(`question-${idx}`)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>

              <hr />
              <div className="mt-3">
                <div className="d-flex align-items-center mb-1">
                  <div
                    className="question-num answered me-2"
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  ></div>
                  <small>Answered</small>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <div
                    className="question-num flagged me-2"
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  ></div>
                  <small>Marked</small>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="question-num unanswered me-2"
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  ></div>
                  <small>Not Answered</small>
                </div>
              </div>
              <hr />
              <div>
                {" "}
                <Button
                  variant="primary"
                  className=" btn-sm w-100"
                  onClick={() => setShowSubmit(true)}
                >
                  Submit
                </Button>
                <Button
                  variant="warning"
                  className="btn-sm w-100 mt-2"
                  onClick={() => sendProgress()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <SubmitConfirmModal
        show={showSubmit}
        setShowSubmit={setShowSubmit}
        handleSubmit={handleSubmit}
        answered={answered}
        total={total}
      />
      {/* Result modal */}
      <ResultModal
        show={resultModal}
        handleClose={() => navigate("/exam")}
        score={studentExam.score}
      />
    </div>
  );
};
