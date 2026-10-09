// Task Interface
interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  project: string;
}
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Plus, Pencil, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import type { Project } from './ProjectsPage';
import axios from 'axios';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  //Edit project parameters
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  //Edit Task Parameters
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  // Display a single project's details
    useEffect(() =>{
      axios.get(`${API_URL}/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setProject(response.data);
          setName(response.data.name);
          setDescription(response.data.description);
          console.log(response.data);
          setError(null);
        })
        .catch(error=>{
          setError(error.message);
          setProject(null);
          console.log('Token:', token);
        })
        .finally(()=>{
          setLoading(false);
        })
    }, []);

  // Fetch tasks for the project
  useEffect(()=>{
    axios.get(`${API_URL}/api/projects/${projectId}/tasks`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response)=>{
      setTasks(response.data);
    })
    .catch(error=>{
      console.error('Error fetching tasks:', error);
      console.log('Token:', token);
    });
  }, []);

    // Handle update project
    const handleSaveChanges = async() => {
      try{
        const response = await axios.put(`${API_URL}/api/projects/${projectId}`, {
          name,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setProject(response.data);
      setEdit(false);
    }
    catch(error){
      console.log('Project update failed:', error);
    }
    };

    // Handle delete Project
    const handleDeleteProject = async () => {
      try {
        await axios.delete(`${API_URL}/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/projects');
      } catch (error) {
        console.log('Project deletion failed:', error);
      }
    };

    // Handle Edit Task
    const handleEditTask = (task: Task)=>{
      setEditingTaskId(task._id);
      setTaskTitle(task.title);
      setTaskDescription(task.description);
      setTaskStatus(task.status);
    }

    // Handle Save Changes for Task
    const handleSaveTaskChanges = async () => {
      try{
        const response = await axios.put(`${API_URL}/api/tasks/${editingTaskId}`, {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(prevTasks => prevTasks.map(task => task._id === editingTaskId ? response.data : task));
        setEditingTaskId(null);
      }
      catch(error){
        console.error('Error saving task changes:', error);
      }
    }

    // Handle Delete Task
    const handleDeleteTask = async (taskId: string) => {
      try {
        await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      }
      catch(error) {
        console.error('Error deleting task:', error);
      }
    }

    if (loading) {
      return <main className="w-full max-w-4xl mx-auto p-5 text-muted">Loading project…</main>;
    }

    if (error) {
      return (
        <main className="w-full max-w-4xl mx-auto p-5">
          <p role="alert" className="text-red-600">{error}</p>
          <Link to="/projects" className="mt-4 inline-flex text-primary hover:text-accent">Back to projects</Link>
        </main>
      );
    }

  return (
    <div className = "w-full max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-heading">{project?.name}</h1>
      <p className="text-muted font-medium py-2"> {project?.description || "Manage authentication and user accounts."} </p>
      {/* Edit project functionality */}
      {edit && (
        <div className="space-y-4 py-2">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-border rounded-md p-2"/>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-border rounded-md p-2"/>
        </div>
      )}
      <div className="flex gap-4 py-2">
        {edit ? (
          <div className="flex gap-4 py-2">
            <button className="text-muted hover:text-accent font-semibold" onClick={() => setEdit(false)}>Cancel</button>
            <button className="text-primary hover:text-accent font-semibold" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        ):
        (
          <div className="flex gap-4 py-2">
            <button
              onClick={() => setEdit(true)}
              className="flex items-center gap-2 text-primary hover:text-accent font-semibold">
              <Pencil size={18} />
              Edit Project
            </button>
            <button
              onClick={handleDeleteProject}
              className="flex items-center gap-2 text-accent hover:text-primary font-semibold">
              <Trash size={18} />
              Delete Project
            </button>
        </div>
      )}
      </div>

      {/* Display a list of tasks */}
      <div>
        <div className="w-full max-w-4xl flex justify-between mx-auto py-2">
          <h2 className = "text-2xl font-bold text-heading py-1 border-b-2 border-primary">Tasks</h2>
          <Link to = {`/projects/${projectId}/tasks/new`} className = "flex items-center gap-2 text-muted hover:text-accent font-semibold">
            <Plus />
            Add Task
          </Link>
        </div>
        {/* Render tasks */}
        {tasks.map((task)=> (
          <div key={task._id} className = "py-3 border-b border-border">
            {editingTaskId === task._id ? (
              <div className="space-y-3">
                <input type = "text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full border border-border rounded-md p-2" />
                <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className="w-full border border-border rounded-md p-2" />
                <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="border border-border rounded-md p-2">
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <div className = "flex gap-4">
                  <button onClick={()=>setEditingTaskId(null) } className="text-muted hover:text-accent font-semibold">Cancel</button>
                  <button onClick={handleSaveTaskChanges} className="text-primary hover:text-accent font-semibold">Save Changes</button>
                </div>
              </div>
            ):(
              <div className="flex justify-between">
                <div>
                  <p className = "font-medium text-heading">{task.title}</p>
                  <p className = "text-sm text-muted mt-1">{task.description}</p>
                </div>
                <div className = "flex items-center gap-2">
                  <p className="text-muted hover:text-accent font-medium">{task.status}</p>
                  {task.status !== "Done" && <ArrowRight />}
                  {task.status === "Done" && <Check />}
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-primary hover:text-accent"
                    aria-label={`Edit ${task.title}`}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-accent hover:text-primary"
                    aria-label={`Delete ${task.title}`}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetailPage;