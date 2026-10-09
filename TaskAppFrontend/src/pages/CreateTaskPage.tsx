import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function CreateTaskPage() {
    const {projectId} = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To Do');
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Handle form submission
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Form submission logic here
        console.log({ title, description, status });
        try{
            await axios.post(`${API_URL}/api/projects/${projectId}/tasks`, {
                title,
                description,
                status
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
            navigate(`/projects/${projectId}`);
        }
        catch(error){
            console.error('Error creating task:', error);
        }
    };
  return (
    <form className="w-full max-w-4xl mx-auto flex flex-col px-4 md:px-6 py-6 gap-5" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-heading">Create Task</h1>
        {/* <p>{projectId}</p> */}
        <label htmlFor = "task-title" className="text-muted font-medium ">Task Title:</label>
        <input type = "text" id = "task-title" className = "border border-border rounded-md shadow-md transition-shadow focus:outline-none focus:ring-1 focus:ring-primary p-2" 
        value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor = "task-description" className="text-muted font-medium ">Task Description:</label>
        <textarea id = "task-description" className = "border border-border rounded-md shadow-md transition-shadow focus:outline-none focus:ring-1 focus:ring-primary" 
        value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor = "task-status" className="text-muted font-medium ">Task Status:</label>
        <select id = "task-status" className = "border border-border rounded-md shadow-md transition-shadow focus:outline-none focus:ring-1 focus:ring-primary p-1"
        value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value = "To Do">To Do</option>
        <option value = "In Progress">In Progress</option>
        <option value = "Done">Done</option>
        </select>
        <button type="submit" className="bg-primary text-surface hover:bg-accent rounded-md py-2 px-4">Create Task</button>
    </form>
  );
}

export default CreateTaskPage;