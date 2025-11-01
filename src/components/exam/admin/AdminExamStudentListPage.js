import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { StudentExamService } from "../../../service/exam/StudentExamService";
import Paging from "../../Paging";
import { PagingUtils } from "../../../utils/PagingUtils";
import { UserService } from "../../../service/UserService";

function AdminExamStudentListPage() {
  const { examId } = useParams();
  const [user, setUser] = useState([]);
  const [examPage, setExamPage] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [studentExamList, setStudentExamList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [pageNumber, setPageNumber] = useState(pageParam);
  const itemsPerPage = 12;

  // Đồng bộ query param với state
  useEffect(() => {
    setPageNumber(pageParam);
  }, [pageParam]);

  // Lấy danh sách StudentExam theo examId
  useEffect(() => {
    if (!examId) return;
    UserService.getAllUsers()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => setErrorMessage(error.message));

    StudentExamService.getStudentExamByExamId(examId)
      .then((data) => {
        setStudentExamList(data);
      })
      .catch((error) => setErrorMessage(error.message));
  }, [examId]);

  function getStudentName(userId) {
    const student = user.find((u) => u.id === userId);
    return student ? student.username : "Unknown Student";
  }

  // Lọc và phân trang
  useEffect(() => {
    let filtered = studentExamList;

    setFilteredList(filtered);
    const pageData = PagingUtils.getPage(filtered, pageNumber, itemsPerPage);
    setExamPage(pageData);
  }, [studentExamList, pageNumber]);

  // Phân trang
  function navigatePage(page) {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);

    navigate(`/admin/exam/student-exams/${examId}?${queryParams.toString()}`);
  }

  function getExamStatus(record) {
    switch (record.status) {
      case "Submitted":
        return (
          <span className="text-success" style={{ fontWeight: "bold" }}>
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="text-warning" style={{ fontWeight: "bold" }}>
            In Progress
          </span>
        );
      case "Suspended":
        return (
          <span className="text-danger" style={{ fontWeight: "bold" }}>
            Suspended
          </span>
        );
      default:
        return (
          <span className="text-secondary" style={{ fontWeight: "bold" }}>
            Unknown
          </span>
        );
    }
  }

  return (
    <div className="container py-4">
      <h2>Exam Participants</h2>
      <p>View all student submissions for this exam.</p>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      <div className="mt-4">
        <div className="row">
          {examPage?.pagedRecords?.length > 0 ? (
            examPage.pagedRecords.map((record) => (
              <div key={record.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <h5>
                        Student:{" "}
                        <span className="fw-semibold">
                          {getStudentName(record.userId)}
                        </span>
                      </h5>
                    </Card.Title>
                    <div className="text-muted mb-2">
                      <strong>Score:</strong>
                      <span
                        className={
                          record.score <= 4 ? "text-danger" : "text-success"
                        }
                        style={{ fontWeight: "bold", marginLeft: "5px" }}
                      >
                        {record.score ?? "N/A"}
                      </span>
                    </div>
                    <div className="text-muted mb-2">
                      <strong>Date:</strong>{" "}
                      {new Date(record.startDate).toLocaleString()}
                    </div>
                    <div className="text-muted mb-3">
                      <strong>Status:</strong> {getExamStatus(record)}
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/admin/exam/student-exam/detail/${record.id}`)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() =>
                        navigate(`/admin/exam/student-exam/logs/${record.id}`)
                      }
                      className="ms-2"
                    >
                      View Logs
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No student exams found.</p>
          )}
        </div>
      </div>

      <Paging
        className="mt-4"
        {...{
          totalPages: examPage.totalPages,
          currentPage: examPage.pageNumber,
          onPageChange: navigatePage,
        }}
      />
    </div>
  );
}

export default AdminExamStudentListPage;
