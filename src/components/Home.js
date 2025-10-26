import Footer from "./Footer";
import Header from "./Header";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Header />

      <div className="container py-4">
        <h2>Welcome</h2>
        <p>Use the links below to test auth pages:</p>
        <div className="d-flex gap-3">
          <Link className="btn btn-primary" to="/login">
            Go to Login
          </Link>
          <Link className="btn btn-secondary" to="/register">
            Go to Register
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
