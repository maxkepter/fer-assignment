import { useEffect, useState } from "react";
import { ExamService } from "../../../service/exam/ExamService";
import { Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Paging from "../../Paging";
import { PagingUtils } from "../../../utils/PagingUtils";

function ExamPage() {
  const [examPage, setExamPage] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const searchParam = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [pageNumber, setPageNumber] = useState(pageParam);
  const examsPerPage = 36;

  //Sync URL param ưith state
  useEffect(() => {
    setPageNumber(pageParam);
    setSearchQuery(searchParam);
    setSearchInput(searchParam);
  }, [pageParam, searchParam]);

  // Load all exams
  useEffect(() => {
    ExamService.getAllExams()
      .then((data) => setExams(data))
      .catch((error) => setErrorMessage(error.message));
  }, []);

  // Filter and paginate (only run when searchQuery or pageNumber changes)
  useEffect(() => {
    let filtered = exams;
    if (searchQuery.trim() !== "") {
      filtered = exams.filter((exam) =>
        exam.examName.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }
    setFilteredExams(filtered);

    const pageData = PagingUtils.getPage(filtered, pageNumber, examsPerPage);
    setExamPage(pageData);
  }, [exams, searchQuery, pageNumber]);

  // When clicking the Search button
  function handleSearch(e) {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchInput.trim() !== "")
      queryParams.append("search", searchInput.trim());
    queryParams.append("page", 1); // reset to page 1 when searching
    navigate(`/exam?${queryParams.toString()}`);
  }

  // Navigate to a specific page
  function navigatePage(page) {
    const queryParams = new URLSearchParams();
    if (searchQuery.trim() !== "")
      queryParams.append("search", searchQuery.trim());
    queryParams.append("page", page);
    navigate(`/exam?${queryParams.toString()}`);
  }

  // Reset form
  function handleReset() {
    setSearchInput("");
    navigate("/exam?page=1");
  }

  return (
    <div className="container py-4">
      <h2>English Test</h2>
      <p>
        Practice and test your English level with a variety of multiple choice
        tests.
      </p>

      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3" controlId="formSearch">
          <Form.Label>Search Tests</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter keywords to search tests"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
        <Button variant="danger" className="ms-2" onClick={handleReset}>
          Reset
        </Button>
      </Form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="mt-4">
        <div className="row">
          {examPage?.pagedRecords?.length > 0 ? (
            examPage.pagedRecords.map((exam) => (
              <div key={exam.id} className="col-md-4 mb-4">
                <Card>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>
                      <h5>{exam.examName}</h5>
                    </Card.Title>

                    <div className="mb-4">
                      <div className="d-flex align-items-center text-muted mb-2">
                        <i className="bi bi-question-circle me-1" />
                        {exam.numberQuestion} questions
                      </div>
                      <div className="d-flex align-items-center text-muted mb-2">
                        <i className="bi bi-hourglass me-1" />
                        {exam.duration} minutes
                      </div>
                    </div>

                    <Link
                      to={`/exam/do/${exam.id}`}
                      className="btn btn-primary mt-auto"
                    >
                      Take Test
                    </Link>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No exams found.</p>
          )}
        </div>
      </div>

      <Paging
        className="mt-4"
        totalPages={examPage.totalPages}
        currentPage={examPage.pageNumber}
        onPageChange={navigatePage}
      />
    </div>
  );
}

export default ExamPage;
