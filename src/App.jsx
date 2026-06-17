import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useSocket from "./hooks/useSocket";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import InterviewRunner from "./pages/InterviewRunner";
import SessionReview from "./pages/SessionReview";
import NotFound from "./pages/NotFound";
import LiveBackground from "./components/LiveBackground";


const App = () => {
  useSocket();

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans relative">
      <LiveBackground />
      <main className="flex-1 w-full flex flex-col relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
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

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
    </div>
  );
};

export default App;