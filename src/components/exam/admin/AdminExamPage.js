import { useEffect, useState } from "react";
import { ExamService } from "../../../service/exam/ExamService";
import { Button, Card, Form, Modal } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Paging from "../../Paging";
import { PagingUtils } from "../../../utils/PagingUtils";

function AdminExamPage() {
  const [examPage, setExamPage] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [exams, setExams] = useState([]);
  const [reload, setReload] = useState(false);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [pageNumber, setPageNumber] = useState(page ? parseInt(page) : 1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteExamId, setDeleteExamId] = useState(null);
  const examsPerPage = 12;
  const navigate = useNavigate();
  useEffect(() => {
    ExamService.getAllExams()
      .then((data) => {
        const tempData = data;
        setExams(tempData);
        setExamPage(handlePaging(tempData));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [reload]);
  function handlePaging(exams) {
    let data = PagingUtils.getPage(exams, pageNumber, examsPerPage);
    return data;
  }

  function handleSearch(e) {
    e.preventDefault();

    let filteredExams = exams;
    if (searchQuery && searchQuery.trim() !== "") {
      filteredExams = exams.filter((exam) =>
        exam.examName.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }
    const pageData = handlePaging(filteredExams);
    setExamPage(pageData);
  }

  const deleteExam = (examId) => {
    ExamService.deleteExam(examId)
      .then(() => {
        setReload(!reload);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  function navigatePage(page) {
    let queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.append("search", searchQuery);
    }
    queryParams.append("page", page);
    navigate(`/exams?${queryParams.toString()}`);
  }

  return (
    <div>
      <div className="container  py-4">
        <h2>English Test</h2>
        <p>
          Practice and test your English level with a variety of multiple choice
          tests.
        </p>
        <Link to="./create" className="mb-3 btn btn-primary">
          Create New Test
        </Link>

        <Form>
          <Form.Group className="mb-3" controlId="formSearch">
            <Form.Label>Search Tests</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter keywords to search tests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSearch}>
            Search
          </Button>
          <Button
            variant="danger"
            className="ms-2"
            onClick={() => {
              setSearchQuery("");
              setReload(!reload);
            }}
          >
            Reset
          </Button>
        </Form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div className="mt-4">
          <div className="row">
            {examPage &&
            examPage.pagedRecords &&
            examPage.pagedRecords.length > 0 ? (
              examPage.pagedRecords.map((exam) => {
                return (
                  <div key={exam.id} className="col-md-4 mb-4">
                    <Card>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>
                          <h5>{exam.examName}</h5>
                        </Card.Title>

                        <div className="mb-4">
                          <div className="d-flex align-items-center text-muted mb-2">
                            <strong className="me-1">Total Questions:</strong>
                            {exam.questions.length} questions
                          </div>
                          <div className="d-flex align-items-center text-muted mb-2">
                            <strong className="me-1">Questions In Exam:</strong>
                            {exam.numberQuestion} questions
                          </div>
                          <div className="d-flex align-items-center text-muted  mb-2">
                            <strong className="me-1">Duration:</strong>
                            {exam.duration}
                            minutes
                          </div>
                        </div>
                        <Link to={`./${exam.id}`} className="btn btn-info mt-2">
                          View Details
                        </Link>
                        <Link
                          to={`../exam/student-exams/${exam.id}`}
                          className="btn btn-success mt-2"
                        >
                          View Student Exam
                        </Link>
                        <Button
                          className="btn-danger mt-2"
                          onClick={() => {
                            setDeleteExamId(exam.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })
            ) : (
              <p>No exams found.</p>
            )}
          </div>
        </div>
        {/* Confirm delete Modal */}
        <Modal scrollable show={showDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this exam? This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowDeleteModal(false);
                deleteExam(deleteExamId);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <Paging
          className="mt-4"
          {...{
            totalPages: examPage.totalPages,
            currentPage: examPage.pageNumber,
            onPageChange: navigatePage,
          }}
        />
      </div>
    </div>
  );
}
export default AdminExamPage;
