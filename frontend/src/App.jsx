import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useSocket from "./hooks/useSocket";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import InterviewRunner from "./pages/InterviewRunner";
import SessionReview from "./pages/SessionReview";
import NotFound from "./pages/NotFound";


const App = () => {
  useSocket();

  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen">
      <main className={isAuthPage ? "w-full" : "container mx-auto p-4"}>
        <Routes>
        

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="interview/:sessionId"
              element={<InterviewRunner />}
            />
            <Route
              path="review/:sessionId"
              element={<SessionReview />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </div>
  );
};

export default App;