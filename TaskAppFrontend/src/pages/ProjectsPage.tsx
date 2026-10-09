export interface Project {
  _id: string;
  name: string;
  description: string;
  user: string;
}
import { ArrowRight, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
function ProjectsPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  // const navigate = useNavigate();
  // Read Projects
    useEffect(() =>{
      axios.get(`${API_URL}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setProjects(response.data);
          console.log(response.data);
          setError(null);
        })
        .catch(error=>{
          setError(error.message);
          setProjects([]);
        })
        .finally(()=>{
          setLoading(false);
        })
    }, []);
    // ProjectsPage();
  
    if(error){
      console.log(error);
    }
    if(loading){
      return <h3>Loading...</h3>;
    }

  return (
    <main>
      {/* Header section */}
      <div className = "w-full md:max-w-4xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
        <h1 className= "text-2xl font-bold text-heading">My Projects</h1>
        <Link to="/projects/new" className = "flex items-center gap-2 text-primary hover:text-accent">
            <Plus />
            New Project
        </Link>
      </div>

      {/* Search bar */}
      <div className = "w-full md:max-w-4xl mx-auto px-4 md:px-6 flex items-center gap-4">
        <Search className="text-muted" />
        <input type="text" placeholder="Search projects..." className = "w-full md:max-w-xl px-4 py-3 border border-border rounded-lg"/>
      </div>

      {/* Project list */}
      <div className = "w-full md:max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project cards would go here */}
          {projects.map((project)=>(
            <div key={project._id} className="flex flex-col bg-surface rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
              <h2 className = "text-lg font-semibold text-heading py-2">{project.name}</h2>
              <p className="text-muted">{project.description}</p>
              <Link to = {`/projects/${project._id}`} className="text-primary hover:text-accent flex items-center gap-2 mt-4">
                View Project <ArrowRight />
              </Link>
            </div>
          )
          )}
        </div>
      </div>
    </main>
  );
}

export default ProjectsPage;