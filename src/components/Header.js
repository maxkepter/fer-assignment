import { UserContext } from "../UserContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
function Header({ index, navItem, disable }) {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  function handleLogout() {
    setUser({});
    navigate("/");
  }

  return (
    <header
      className="sticky-top shadow-lg bg-light"
      style={{
        display: disable ? "none" : "block",
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-light bg-light container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg,#4f46e5,#6366f1)",
            }}
          >
            <span className="text-white fw-bold fs-4">EP</span>
          </div>
          <span className="ms-2 fw-bold fs-3 text-dark">English Pro</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user && user.username ? (
            <div className="d-flex w-100 justify-content-between align-items-center">
              <ul className="navbar-nav ms-auto me-4">
                {navItem &&
                  navItem.map((item, idx) => (
                    <li className="nav-item" key={idx}>
                      <a
                        className={
                          idx === index
                            ? "nav-link text-dark fw-medium"
                            : "nav-link"
                        }
                        href={item.link}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
              </ul>
              <div className="me-3 d-flex align-items-centers gap-3 r">
                <p className="m-auto"> Xin chào, {user.username}</p>
                <button
                  className="btn "
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex w-100 justify-content-end align-items-center">
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn text-white"
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
