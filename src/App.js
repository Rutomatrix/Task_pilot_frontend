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
      <div className="flex h-screen">
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto bg-[#f2f7fa] p-6 pl-64">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/team" element={<Team />} />
            <Route path="/client" element={<Client />} />
            <Route path="/project" element={<Project />} />
            <Route path="/task" element={<Task />} />
            <Route path="/employees" element={<Employees />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
