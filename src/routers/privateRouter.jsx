import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

// Pages
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AddQuizPage from "@/pages/admin/quiz/AddQuiz";
import QuizzesPage from "@/pages/admin/quiz/Quizzes";
import QuizSettingsPage from "@/pages/admin/quiz/EditQuiz";
import EditQuizQuestionsPage from "@/pages/admin/quiz/EditQuizQuestions";
import EditQuizStudentPage from "@/pages/admin/quiz/EditQuizStudents";
import EditQuizPermissionsPage from "@/pages/admin/quiz/EditQuizPermissions";
import QuizResultsPage from "@/pages/admin/quiz/QuizResults";
import NotFound from "@/pages/404Page";

const PrivateRouter = () => {
  const [isReady, setIsReady] = useState(false);
  const { setCurrentUser, currentUser } = useAuth();

  // Pages

  useEffect(() => {
    preload();
  }, []);

  const preload = async () => {
    const user = localStorage.getItem("persian-quiz-user");

    if (!!user) {
      setCurrentUser(JSON.parse(user));
      setIsReady(true);
    }
  };

  if (!isReady) return null;

  // Redirect non-admin users from admin routes with a full page refresh
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  if (isAdminRoute && currentUser?.role !== "admin") {
    window.location.replace("/");
    return null;
  }

  return (
    <Routes>
      <Route path="login" element={<Navigate to="/admin/dashboard" />} />

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="quizzes" element={<QuizzesPage />} />
        <Route path="quizzes/add" element={<AddQuizPage />} />
        <Route path="quizzes/:id/settings" element={<QuizSettingsPage />} />
        <Route
          path="quizzes/:id/questions"
          element={<EditQuizQuestionsPage />}
        />
        <Route path="quizzes/:id/students" element={<EditQuizStudentPage />} />
        <Route path="quizzes/:id/results" element={<QuizResultsPage />} />
        <Route path="quizzes/:id/permissions" element={<EditQuizPermissionsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PrivateRouter;
