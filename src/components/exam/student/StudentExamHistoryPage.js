import { useContext, useEffect, useState } from "react";
import { StudentExamService } from "../../../service/exam/StudentExamService";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Paging from "../../Paging";
import { PagingUtils } from "../../../utils/PagingUtils";
import { UserContext } from "../../../UserContext";

function StudentExamHistoryPage() {
  const { user } = useContext(UserContext);
  const [examPage, setExamPage] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [historyList, setHistoryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const searchParam = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchParam); // chỉ để nhập
  const [searchQuery, setSearchQuery] = useState(searchParam); // để thực hiện lọc
  const [pageNumber, setPageNumber] = useState(pageParam);
  const itemsPerPage = 12;

  // Đồng bộ URL param với state
  useEffect(() => {
    setPageNumber(pageParam);
    setSearchQuery(searchParam);
    setSearchInput(searchParam);
  }, [pageParam, searchParam]);

  // Load toàn bộ dữ liệu
  useEffect(() => {
    if (!user?.id) return;
    StudentExamService.getStudentExamByUserId(user.id)
      .then((data) => {
        setHistoryList(
          data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        );
      })
      .catch((error) => setErrorMessage(error.message));
  }, [user]);

  // Lọc và phân trang (chỉ chạy khi searchQuery hoặc pageNumber thay đổi)
  useEffect(() => {
    let filtered = historyList;

    if (searchQuery.trim() !== "") {
      filtered = historyList.filter((item) =>
        item.exam.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    setFilteredList(filtered);
    const pageData = PagingUtils.getPage(filtered, pageNumber, itemsPerPage);
    setExamPage(pageData);
  }, [historyList, pageNumber, searchQuery]);

  // Khi bấm nút Search
  function handleSearch(e) {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchInput.trim() !== "")
      queryParams.append("search", searchInput.trim());
    queryParams.append("page", 1); // quay về trang đầu
    navigate(`/history?${queryParams.toString()}`);
  }

  // Khi bấm nút phân trang
  function navigatePage(page) {
    const queryParams = new URLSearchParams();
    if (searchQuery.trim() !== "")
      queryParams.append("search", searchQuery.trim());
    queryParams.append("page", page);
    navigate(`/history?${queryParams.toString()}`);
  }

  function getExamStatus(record) {
    switch (record.status) {
      case "Submitted":
        return <span className="text-success">Completed</span>;
      case "In Progress":
        return <span className="text-warning">In Progress</span>;
      case "Suspended":
        return <span className="text-danger">Suspended</span>;
      default:
        return <span className="text-secondary">Unknown</span>;
    }
  }

  return (
    <div className="container py-4">
      <h2>Exam History</h2>
      <p>View all your completed exams and scores.</p>

      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3" controlId="formSearch">
          <Form.Label>Search by Exam</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter exam name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
        <Button
          variant="danger"
          className="ms-2"
          onClick={() => {
            setSearchInput("");
            navigate("/history?page=1");
          }}
        >
          Reset
        </Button>
      </Form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="mt-4">
        <div className="row">
          {examPage?.pagedRecords?.length > 0 ? (
            examPage.pagedRecords.map((record) => (
              <div key={record.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <h5>Exam: {record.exam.name}</h5>
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
                      <strong>Status:</strong>{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {getExamStatus(record)}
                      </span>
                    </div>
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate(`/history/${record.id}`)}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No exam history found.</p>
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

export default StudentExamHistoryPage;
