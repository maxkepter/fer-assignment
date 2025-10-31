import { useEffect, useState } from "react";
import { ExamService } from "../../../service/exam/ExamService";
import { Button, Card, Form } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Paging from "../../Paging";
import { PagingUtils } from "../../../utils/PagingUtils";
import { useOutletContext } from "react-router-dom";
function ExamPage() {
  const [examPage, setExamPage] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [exams, setExams] = useState([]);
  const [reload, setReload] = useState(false);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [pageNumber, setPageNumber] = useState(page ? parseInt(page) : 1);
  const examsPerPage = 36;
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
    console.log("Filtered Exams:", filteredExams);
    const pageData = handlePaging(filteredExams);
    setExamPage(pageData);
  }
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              className="me-1 bi bi-question-circle"
                            >
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                            </svg>
                            {exam.questions.length} questions
                          </div>
                          <div className="d-flex align-items-center text-muted  mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              className="me-1 bi bi-hourglass"
                            >
                              <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z" />
                            </svg>
                            {exam.duration}
                            minutes
                          </div>
                        </div>
                        <Link
                          href={`/exam/take/${exam.id}`}
                          className="btn btn-primary mt-auto"
                        >
                          Take Test{" "}
                        </Link>
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
export default ExamPage;
