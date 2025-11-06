import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Team from "./pages/Team";
import Client from "./pages/Client";
import Project from "./pages/Project";
import Task from "./pages/Task";
import Employees from "./pages/Employees";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 p-8">
          <Routes>
            {/* Default route redirects to /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/team" element={<Team />} />
            <Route path="/client" element={<Client />} />
            <Route path="/project" element={<Project />} />
            <Route path="/task" element={<Task />} />
            <Route path="/employees" element={<Employees />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
