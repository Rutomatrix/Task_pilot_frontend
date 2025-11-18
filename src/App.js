import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";


import Client from "./pages/clients/Client";
import ClientAdd from "./pages/clients/ClientAdd";
import ClientShow from "./pages/clients/ClientShow";
import ClientEdit from "./pages/clients/ClientEdit";


import Team from "./pages/teams/Team";
import TeamAdd from "./pages/teams/TeamAdd";
import TeamShow from "./pages/teams/TeamShow";
import TeamEdit from "./pages/teams/TeamEdit";

import Project from "./pages/projects/Project";
import ProjectAdd from "./pages/projects/ProjectAdd";
import ProjectShow from "./pages/projects/ProjectShow";
import ProjectEdit from "./pages/projects/ProjectEdit";

import Task from "./pages/tasks/Task";
import TaskAdd from "./pages/tasks/TaskAdd";
import TaskShow from "./pages/tasks/TaskShow";
import TaskEdit from "./pages/tasks/TaskEdit";

import Employees from "./pages/employees/Employees";
import EmployeesAdd from "./pages/employees/EmployeesAdd";
import EmployeesShow from "./pages/employees/EmployeesShow";
import EmployeesEdit from "./pages/employees/EmployeesEdit";

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

            {/* Clients routes */}
            <Route path="/clients" element={<Client />} />
            <Route path="/clients/add" element={<ClientAdd />} />
            <Route path="/clients/:id" element={<ClientShow />} />
            <Route path="/clients/:id/edit" element={<ClientEdit />} />

            {/* Teams routes */}
            <Route path="/teams" element={<Team />} />
            <Route path="/teams/add" element={<TeamAdd />} />
            <Route path="/teams/:id" element={<TeamShow />} />
            <Route path="/teams/:id/edit" element={<TeamEdit />} />

            {/* Projects routes */}
            <Route path="/projects" element={<Project />} />
            <Route path="/projects/add" element={<ProjectAdd />} />
            <Route path="/projects/:id" element={<ProjectShow />} />
            <Route path="/projects/:id/edit" element={<ProjectEdit />} />

            {/* Projects routes */}
            <Route path="/tasks" element={<Task />} />
            <Route path="/tasks/add" element={<TaskAdd />} />
            <Route path="/tasks/:id" element={<TaskShow />} />
            <Route path="/tasks/:id/edit" element={<TaskEdit />} />

            {/* Employees routes */}
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/add" element={<EmployeesAdd />} />
            <Route path="/employees/:id" element={<EmployeesShow />} />
            <Route path="/employees/:id/edit" element={<EmployeesEdit />} />

            <Route path="/employees" element={<Employees />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
