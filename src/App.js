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
import { DoExam } from "./components/exam/student/DoExam";
import StudentExamHistoryPage from "./components/exam/student/StudentExamHistoryPage";
import { StudentExamDetail } from "./components/exam/student/StudentExamDetail";
import AdminExamStudentListPage from "./components/exam/admin/AdminExamStudentListPage";
import { AdminStudentExamDetails } from "./components/exam/admin/AdminStudentExamDetails";
import { StudentExamLog } from "./components/exam/admin/StudentExamLog";
import AuthWrapper from "./components/auth/AuthWapper";

function App() {
  return (
    <Routes>
      {/* --- Public routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- Student routes --- */}
      <Route element={<AuthWrapper role={["Admin", "Student"]} />}>
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<Home />} />
          <Route path="exam" element={<ExamPage />} />
          <Route path="history" element={<StudentExamHistoryPage />} />
          <Route path="history/:id" element={<StudentExamDetail />} />
        </Route>
        <Route path="exam/do/:examId" element={<DoExam />} />
      </Route>

      {/* --- Admin routes --- */}
      <Route element={<AuthWrapper role={["Admin"]} />}>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="exam" element={<AdminExamPage />} />
          <Route path="exam/create" element={<CreateExam />} />
          <Route path="exam/:id" element={<ExamDetail />} />
          <Route
            path="exam/student-exams/:examId"
            element={<AdminExamStudentListPage />}
          />
          <Route
            path="exam/student-exam/detail/:id"
            element={<AdminStudentExamDetails />}
          />
          <Route
            path="exam/student-exam/logs/:studentExamId"
            element={<StudentExamLog />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
