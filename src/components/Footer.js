function Footer() {
  return (
    <footer class="bg-dark text-white py-5">
      <div class="container">
        <div class="row gy-4">
          <div class="col-md-6">
            <div class="d-flex align-items-center mb-3">
              <div
                class="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                }}
              >
                <span class="text-white fw-bold fs-4">E</span>
              </div>
              <span class="ms-2 fs-3 fw-bold">EduTest</span>
            </div>
            <p class="text-secondary">
              Nền tảng thi online hàng đầu Việt Nam, mang đến trải nghiệm học
              tập hiện đại và hiệu quả.
            </p>
          </div>

          <div class="col-md-2">
            <h5 class="fw-semibold mb-3">Sản phẩm</h5>
            <ul class="list-unstyled">
              <li>
                <a
                  href="/exams"
                  className="text-secondary text-decoration-none hover-text-light"
                >
                  Bài thi
                </a>
              </li>
              <li>
                <a
                  href="/practice"
                  className="text-secondary text-decoration-none hover-text-light"
                >
                  Ôn luyện
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  className="text-secondary text-decoration-none hover-text-light"
                >
                  Báo cáo
                </a>
              </li>
              <li>
                <a
                  href="/statistics"
                  className="text-secondary text-decoration-none hover-text-light"
                >
                  Thống kê
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr class="my-4 border-secondary" />
        <p class="text-center text-secondary mb-0">&copy; 2036 EduTest...</p>
      </div>
    </footer>
  );
}
export default Footer;
