import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    // Handle form submission
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    try{
        const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
        // console.log("API URL:", API_URL);
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
    }
    catch(error) {
        console.error('Login failed:', error);
    }
    // console.log('Email:', email);
    // console.log('Password:', password);
    };
  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
            <h1 className="text-2xl font-bold text-heading">
                Welcome back
            </h1>
            <p className="text-muted mt-1 mb-6">
                Log in to your TaskItEasy account.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-heading mb-2">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-heading mb-2">Password</label>
                    <input type="password" id="password" className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent">
                Login
                </button>
            </form>
            <p className="text-sm text-muted text-center mt-6">Not a registered user? <Link to="/register" className="text-primary hover:text-accent font-medium">Sign up here</Link>.</p>
        </div>
    </div>
  );
}

export default LoginPage;