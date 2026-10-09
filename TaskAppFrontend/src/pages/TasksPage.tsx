import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, ListTodo, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

type TaskStatus = 'To Do' | 'In Progress' | 'Done';
type StatusFilter = 'All' | TaskStatus;

interface Project {
  _id: string;
  name: string;
}

interface ApiTask {
  _id: string;
  title: string;
  description: string;
  status?: TaskStatus;
}

interface Task extends ApiTask {
  status: TaskStatus;
  projectId: string;
  projectName: string;
}

function TasksPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  useEffect(() => {
    axios.get<Project[]>(`${API_URL}/api/projects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async response => {
        const projectData = response.data;
        const taskGroups = await Promise.all(projectData.map(project =>
          axios.get<ApiTask[]>(`${API_URL}/api/projects/${project._id}/tasks`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(taskResponse => taskResponse.data.map(task => ({
            ...task,
            status: task.status ?? 'To Do',
            projectId: project._id,
            projectName: project.name
          })))
        ));

        setTasks(taskGroups.flat());
        setError(null);
      })
      .catch(requestError => {
        setError(requestError.message);
        setTasks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_URL, token]);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((task) => task.status === 'To Do').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    done: tasks.filter((task) => task.status === 'Done').length,
  };

  const searchText = search.toLowerCase();
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesSearch = `${task.title} ${task.description} ${task.projectName}`.toLowerCase().includes(searchText);
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">My Tasks</h1>
          <p className="text-muted mt-1">Tasks from all your projects.</p>
        </div>
        <Link to="/projects" className="flex items-center gap-2 text-primary hover:text-accent font-semibold">
          Browse Projects <ArrowUpRight size={18} />
        </Link>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="font-semibold text-muted">All Tasks</p>
          <p className="text-3xl font-bold text-heading py-1">{loading ? '…' : counts.all}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="font-semibold text-muted">In Progress</p>
          <p className="text-3xl font-bold text-primary py-1">{loading ? '…' : counts.inProgress}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="font-semibold text-muted">Completed</p>
          <p className="text-3xl font-bold text-emerald-700 py-1">{loading ? '…' : counts.done}</p>
        </div>
      </div>

      <section className="bg-surface border border-border rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-heading">Task List</h2>
          <label className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-muted sm:w-72">
            <Search size={18} />
            <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search tasks..." className="w-full outline-none text-body" />
          </label>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['All', 'To Do', 'In Progress', 'Done'] as StatusFilter[]).map(filter => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${statusFilter === filter ? 'bg-primary text-white' : 'bg-app-bg text-muted hover:text-heading'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-6 text-center text-muted">Loading tasks...</p>
        ) : filteredTasks.length > 0 ? (
          <div>
            {filteredTasks.map(task => (
              <div key={task._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-t border-border">
                <div>
                  <h3 className="font-semibold text-heading">{task.title}</h3>
                  <p className="text-sm text-muted mt-1">{task.description}</p>
                  <Link to={`/projects/${task.projectId}`} className="text-sm text-primary hover:text-accent flex items-center gap-1 mt-2">
                    {task.projectName} <ArrowUpRight size={14} />
                  </Link>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium self-start sm:self-auto ${task.status === 'Done' ? 'bg-emerald-100 text-emerald-800' : task.status === 'In Progress' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-700'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <ListTodo size={28} className="mx-auto text-primary mb-3" />
            <p className="font-semibold text-heading">{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</p>
            <p className="text-sm text-muted mt-1">{tasks.length === 0 ? 'Create tasks from your project pages to see them here.' : 'Try a different search or status filter.'}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default TasksPage;