import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import { StudentExamService } from "../../../service/exam/StudentExamService";
import { Button, Spinner } from "react-bootstrap";
import { ErrorModal } from "../../modal/ErrorModal";

export const AdminStudentExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [studentExam, setStudentExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await StudentExamService.getStudentExamById(id);
        console.log("Fetched StudentExam:", data);
        setStudentExam(data);
      } catch (err) {
        setError(err.message || "Failed to load exam detail");
      }
    };

    fetchExam();
  }, [id]);

  if (error) {
    return (
      <ErrorModal
        show={error}
        message={error}
        onHide={() => {
          navigate("../student-exams/" + studentExam?.examId);
        }}
      />
    );
  }
  if (!studentExam) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Lấy danh sách lựa chọn sinh viên
  const studentChoices = studentExam.studentChoices || [];

  function isOptionSelected(questionId, optionId) {
    return studentChoices.some(
      (choice) =>
        choice.questionId === questionId && choice.optionId === optionId
    );
  }

  function isOptionCorrect(option) {
    return option.isCorrect === true;
  }

  return (
    <div
      className="student-exam-detail-page"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <style>{`
        .question-card {
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 10px;
          background: white;
        }
        .option-label {
          display: block;
          padding: 10px 14px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: .2s;
        }
        .option-label.selected {
          border-color: #0d6efd;
          background: #e9f2ff;
        }
        .option-label.correct {
          border-color: #198754;
          background: #d1e7dd;
        }
        .option-label.wrong.selected {
          border-color: #dc3545;
          background: #f8d7da;
        }
      `}</style>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>{studentExam.exam.name}</h3>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <p>
          <strong>Score:</strong>{" "}
          {studentExam.score != null ? studentExam.score : "N/A"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(studentExam.startDate).toLocaleString()}
        </p>

        <hr />

        {studentExam.examDetail.map((q, idx) => (
          <div key={q.questionId} className="question-card">
            <h6 className="fw-bold mb-2">
              Question {idx + 1}: {q.questionContent}
            </h6>

            {q.options.map((opt) => {
              const selected = isOptionSelected(q.questionId, opt.optionId);
              const correct = isOptionCorrect(opt);
              const classes = [
                "option-label",
                selected ? "selected" : "",
                correct ? "correct" : "",
                selected && !correct ? "wrong selected" : "",
              ].join(" ");

              return (
                <label key={opt.optionId} className={classes}>
                  <input type="checkbox" checked={!!selected} hidden readOnly />
                  {opt.optionContent}
                </label>
              );
            })}
          </div>
        ))}
      </div>

      {/* Error Modal */}
      <ErrorModal
        show={error}
        message={error}
        onHide={() => {
          navigate("../student-exams/" + studentExam?.examId);
        }}
      />
    </div>
  );
};
