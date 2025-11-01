import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { ExamLogService } from "../../../service/exam/ExamLogService";
import { StudentExamService } from "../../../service/exam/StudentExamService";
export const StudentExamLog = () => {
  const { studentExamId } = useParams();
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [studentExam, setStudentExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentExamId) return;

    StudentExamService.getStudentExamById(studentExamId)
      .then((data) => {
        setStudentExam(data);
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to load student exam.");
      });

    ExamLogService.getLogsByStudentExamId(studentExamId)
      .then((data) => {
        console.log("Fetched Logs:", data);
        const sortedLogs = [...data].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLogs(sortedLogs);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to load logs.");
        setLoading(false);
      });
  }, [studentExamId]);

  if (loading) return <div className="p-4">Loading logs...</div>;
  if (errorMessage)
    return <div className="text-danger p-4">{errorMessage}</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Exam Activity Logs</h2>
          <p className="text-muted mb-0">
            View all recorded actions of this student during the exam.
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      {logs.length === 0 ? (
        <p>No activity logs found for this student exam.</p>
      ) : (
        <div className="row">
          {logs.map((log) => (
            <div key={log.id} className="col-12 mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title className="mb-1">
                        <strong>{log.action}</strong>
                      </Card.Title>
                      <Card.Text className="text-muted mb-1">
                        {log.detail}
                      </Card.Text>
                      <small className="text-secondary">
                        {new Date(log.timestamp).toLocaleString()}
                      </small>
                    </div>
                    <div className="ms-3 text-end">
                      <span className="badge bg-light text-dark">
                        #{log.id.slice(0, 6)}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
