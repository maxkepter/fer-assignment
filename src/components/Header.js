function Header() {
  return (
    <header class="sticky-top shadow-lg bg-light">
      <nav class="navbar navbar-expand-lg navbar-light bg-light container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <div
            class="rounded d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg,#4f46e5,#6366f1)",
            }}
          >
            <span class="text-white fw-bold fs-4">E</span>
          </div>
          <span class="ms-2 fw-bold fs-3 text-dark">EduTest</span>
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto me-4">
            <li class="nav-item">
              <a className="nav-link active text-dark fw-medium" href="/">
                Trang chủ
              </a>
            </li>
            <li class="nav-item">
              <a className="nav-link text-secondary" href="/">
                Bài thi
              </a>
            </li>
            <li class="nav-item">
              <a className="nav-link text-secondary" href="/">
                Kết quả
              </a>
            </li>
            <li class="nav-item">
              <a className="nav-link text-secondary" href="/">
                Hỗ trợ
              </a>
            </li>
          </ul>

          <div class="d-flex">
            <button class="btn btn-outline-primary me-2">Đăng nhập</button>
            <button
              class="btn text-white"
              style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
