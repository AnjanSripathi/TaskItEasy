import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../index.css';

interface Project {
  _id: string;
  name: string;
  description: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status?: 'To Do' | 'In Progress' | 'Done';
}

interface DashboardTask extends Task {
  projectId: string;
  projectName: string;
}

function DashBoardPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Project[]>(`${API_URL}/api/projects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async response => {
        const projectData = response.data;
        setProjects(projectData);

        const taskGroups = await Promise.all(projectData.map(project =>
          axios.get<Task[]>(`${API_URL}/api/projects/${project._id}/tasks`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(taskResponse => taskResponse.data.map(task => ({
            ...task,
            projectId: project._id,
            projectName: project.name
          })))
        ));

        setTasks(taskGroups.flat());
        setError(null);
      })
      .catch(requestError => {
        setError(requestError.message);
        setProjects([]);
        setTasks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_URL, token]);

  const inProgressCount = tasks.filter((task) => task.status === 'In Progress').length;
  const focusTasks = tasks.filter((task) => task.status !== 'Done').slice(0, 5);

  return (
    <main>
      {/* Greeting card */}
      <div className = "w-full md:max-w-4xl mx-auto px-4 md:px-6 py-2">
        <h1 className="text-2xl font-bold text-heading py-1">Good morning</h1>
        <p className="text-muted font-medium">Here's what needs your attention today.</p>
      </div>

      {error && (
        <p role="alert" className="w-full md:max-w-4xl mx-auto px-4 md:px-6 py-2 text-red-600">
          {error}
        </p>
      )}

      {/* Stats cards */}
      <div className = "grid grid-cols-1 md:grid-cols-2 md:max-w-4xl mx-auto gap-4 py-2">
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className = "font-semibold text-muted">Your Projects</p>
          <h2 className = "text-3xl font-bold text-heading py-1">{loading ? '…' : projects.length}</h2>
          <Link className="text-primary hover:text-accent flex items-center gap-2" to="/projects">
            View Projects <ArrowRight />
          </Link>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className = "font-semibold text-muted">Tasks In Progress</p>
          <h2 className = "text-3xl font-bold text-heading py-1">{loading ? '…' : inProgressCount}</h2>
          <Link className="text-primary hover:text-accent flex items-center gap-2" to="/tasks">
            View Tasks <ArrowRight />
          </Link>
        </div>
      </div>

      {/* Active & Completed tasks */}
      <div className="w-full md:max-w-4xl mx-auto bg-surface border border-border rounded-lg p-5">
        <h2 className = "text-2xl font-bold text-heading py-1 border-b-2 border-primary">Tasks to Focus On</h2>
        <div>
          {loading ? (
            <p className="py-4 text-muted">Loading tasks…</p>
          ) : focusTasks.length > 0 ? (
            focusTasks.map((task, index) => (
              <div key={task._id} className={`flex items-center justify-between py-4 ${index < focusTasks.length - 1 ? 'border-b border-border' : ''}`}>
                <div>
                  <p className="font-medium text-heading">{task.title}</p>
                  <p className="text-sm text-muted">{task.projectName}</p>
                </div>
                <Link className="text-primary hover:text-accent flex items-center gap-2" to={`/projects/${task.projectId}`}>
                  {task.status ?? 'To Do'} <ArrowRight />
                </Link>
              </div>
            ))
          ) : (
            <p className="py-4 text-muted">No open tasks. You’re all caught up!</p>
          )}
        </div>
      </div>

      {/* List of ongoing projects */}
      <div className= "w-full md:max-w-4xl mx-auto bg-surface border border-border rounded-lg p-5">
        <h2 className = "text-2xl font-bold text-heading py-1 border-b-2 border-primary">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {loading ? (
            <p className="text-muted">Loading projects…</p>
          ) : projects.length > 0 ? (
            projects.slice(0, 3).map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="bg-surface border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-heading">{project.name}</h3>
                <p className="text-muted">{project.description}</p>
              </Link>
            ))
          ) : (
            <p className="text-muted">You haven't created any projects yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default DashBoardPage;