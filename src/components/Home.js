import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="container py-4">
        <div className="hero-section">
          <h1 className="display-4 fw-bold">
            Learn English Online. Learn Everytime, Everywhere.
          </h1>
          <p className="lead text-secondary">
            EduTest is an online English testing platform that helps you assess
            and improve your language skills through interactive tests and
            instant feedback .Modern online testing platform with thousands of
            high-quality questions, helping you review and evaluate your
            knowledge effectively.
          </p>
          <Link className="btn btn-primary btn-lg" to="/exam" role="button">
            Take a Test Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
