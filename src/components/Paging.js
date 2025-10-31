import { Button } from "react-bootstrap";

function Paging({ totalPages, currentPage, onPageChange }) {
  const pages = [];
  if (!isNaN(currentPage) && currentPage > 1) {
    pages.push(
      <Button key="prev" onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </Button>
    );
  }

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <Button
        key={i}
        onClick={() => onPageChange(i)}
        disabled={i === currentPage}
        className={i === currentPage ? "active-page" : ""}
      >
        {i === currentPage ? <strong>{i}</strong> : i}
      </Button>
    );
  }

  if (currentPage !== totalPages) {
    pages.push(
      <Button
        key="next"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={currentPage === totalPages ? "disabled-page" : ""}
      >
        Next
      </Button>
    );
  }
  return (
    <div className="paging-container d-flex align-items-center justify-content-center">
      {pages}
    </div>
  );
}
export default Paging;
