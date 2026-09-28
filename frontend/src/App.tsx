import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Notes from "./pages/Notes";
import Knowledge from "./pages/Knowledge";
import Tools from "./pages/Tools";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/chat" element={<Chat />} />

        <Route path="/tasks" element={<Tasks />} />

        <Route path="/projects" element={<Projects />} />

        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />

        <Route path="/notes" element={<Notes />} />

        <Route
          path="/knowledge"
          element={<Knowledge />}
        />

        <Route path="/tools" element={<Tools />} />

        <Route
          path="/calendar"
          element={<Calendar />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
  );
}

export default App;