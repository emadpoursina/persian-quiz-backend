import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

export default function AuthRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      {/* Add more auth-related routes here */}
    </Routes>
  );
}
