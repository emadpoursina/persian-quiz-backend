import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

// Public pages

// Admin pages

const PrivateRouter = () => {
  const [isReady, setIsReady] = useState(false);

  const { setCurrentUser, currentUser } = useAuth();

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
      <Route path="/" element={<Home />} />
      {/* Admin routes */}
      <Route
        path="admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PrivateRouter;
