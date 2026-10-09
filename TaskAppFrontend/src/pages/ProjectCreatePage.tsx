import { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom'
function ProjectCreatePage(){
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
        try{
            e.preventDefault();
            // Handle form submission logic here
            const response = await axios.post(`${API_URL}/api/projects`,{
                name,
                description
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            navigate('/projects');
        } 
        catch (error) {
            console.error('Error creating project:', error);
        }
    }

    return( 
    <form className="w-full max-w-md mx-auto flex flex-col px-4 md:px-6 py-6 gap-5" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-heading">Create Project</h1>
        <label htmlFor = "project-name" className="text-muted font-medium ">Project Name</label>
        <input type = "text" id = "project-name" className = "border border-border rounded-md shadow-md transition-shadow focus:outline-none focus:ring-1 focus:ring-primary p-2" 
        value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor = "project-description" className="text-muted font-medium ">Project Description</label>
        <textarea id = "project-description" className = "border border-border rounded-md shadow-md transition-shadow focus:outline-none focus:ring-1 focus:ring-primary" 
        value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" className="bg-primary text-surface hover:bg-accent rounded-md py-2 px-4">Create Project</button>
    </form>
    )
}
export default ProjectCreatePage;