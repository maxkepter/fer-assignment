function Footer({ isDisable }) {
  return (
    <footer
      class="bg-dark text-white py-5"
      style={{ display: isDisable ? "none" : "block" }}
    >
      <div class="container">
        <div class="row gy-4">
          <div class="col-md-10">
            <div class="d-flex align-items-center mb-3">
              <div
                class="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                }}
              >
                <span class="text-white fw-bold fs-4">EP</span>
              </div>
              <span class="ms-2 fs-3 fw-bold">English Pro</span>
            </div>
            <p class="text-secondary">
              Vietnam's leading online testing platform, providing a modern and
              effective learning experience.
            </p>
          </div>
        </div>

        <hr class="my-4 border-secondary" />
        <p class="text-center text-secondary mb-0">&copy; 2036 EduTest...</p>
      </div>
    </footer>
  );
}
export default Footer;
