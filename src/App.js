import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ExamPage from "./components/exam/student/ExamPage";
import AdminExamPage from "./components/exam/admin/AdminExamPage";
import AdminHomePage from "./components/AdminHome";
import AdminLayout from "./components/AdminLayout";
import { StudentLayout } from "./components/StudentLayout";
import CreateExam from "./components/exam/admin/CreateExam";
import ExamDetail from "./components/exam/admin/ExamDetail";
function App() {
  return (
    <Routes>
      {/* --- Public routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* --- Student routes --- */}
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} /> {/* / */}
        <Route path="/exam/*" element={<ExamPage />} />
      </Route>

      {/* --- Admin routes --- */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminHomePage />} /> {/* /admin */}
        <Route path="exam" element={<AdminExamPage />} /> {/* /admin/exam */}
        <Route path="exam/create" element={<CreateExam />} />
        <Route path="exam/:id" element={<ExamDetail />} />
        {/* /admin/exam */}
      </Route>
    </Routes>
  );
}

export default App;
