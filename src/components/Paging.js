import { Button } from "react-bootstrap";

function Paging({ totalPages = 1, currentPage = 1, onPageChange }) {
  function scrollToTop(smooth = true) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  const pages = [];

  // Button "Previous"
  if (!isNaN(currentPage) && currentPage > 1) {
    pages.push(
      <Button
        key="prev"
        onClick={() => {
          onPageChange(currentPage - 1);
          scrollToTop();
        }}
      >
        Previous
      </Button>
    );
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <Button
        key={i}
        onClick={() => {
          onPageChange(i);
          scrollToTop();
        }}
        disabled={i === currentPage}
        className={i === currentPage ? "active-page" : ""}
      >
        {i === currentPage ? <strong>{i}</strong> : i}
      </Button>
    );
  }

  // Button "Next"
  if (!isNaN(currentPage) && currentPage < totalPages) {
    pages.push(
      <Button
        key="next"
        onClick={() => {
          onPageChange(currentPage + 1);
          scrollToTop();
        }}
      >
        Next
      </Button>
    );
  }

  return (
    <div className="paging-container d-flex align-items-center justify-content-center gap-2 mt-3">
      {pages}
    </div>
  );
}

export default Paging;
