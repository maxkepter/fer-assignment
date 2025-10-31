import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Link, Outlet } from "react-router-dom";

const AdminHomePage = () => {
  return (
    <div>
      <div className="hero-section">
        <h1 className="display-4 fw-bold">
          Learn English Online. Learn Everytime, Everywhere.
        </h1>
        <Link className="btn btn-primary btn-lg" to="exam" role="button">
          Manage Exams
        </Link>
      </div>

      {/* Phần này sẽ bị thay thế bởi nội dung của route con */}
      <Outlet />
    </div>
  );
};

export default AdminHomePage;
