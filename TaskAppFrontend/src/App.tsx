import { Routes, Route } from 'react-router-dom'; // Establish routes to different parts of our application
// Import all the page components
import DashBoardPage from './pages/DashBoardPage';
import LoginPage from './pages/LoginPage';
import ProjectDetailPage from './pages/ProjectDetailPage.tsx';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import AppLayout from './layout/AppLayout';
import ProjectCreatePage from './pages/ProjectCreatePage';
import CreateTaskPage from './pages/CreateTaskPage';
function App(){
  return(
    <div>
      <Routes>
        <Route path = "/" element = {<LoginPage />} />
        <Route path = "/register" element = {<RegisterPage />} />
        {/* Make nested route paths relative to the parent route */}
        <Route element = {<AppLayout />}>
          {/* <Route index element = {<h1>Welcome to the App!</h1>} /> */}
          <Route path = "dashboard" element = {<DashBoardPage />} />
          <Route path = "projects" element = {<ProjectsPage />} />
          <Route path = "projects/:projectId" element = {<ProjectDetailPage />} />
          <Route path = "projects/new" element = {<ProjectCreatePage />} />
          <Route path = "projects/:projectId/tasks/new" element = {<CreateTaskPage />} />
          <Route path = "tasks" element = {<TasksPage />} />
        </Route>
        <Route path = "*" element = {<h1>Page not found</h1>} />
      </Routes>
    </div>
  )
}
export default App;