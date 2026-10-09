import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle registration logic here
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, { username, email, password });
      console.log('Registration successful:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
            <h1 className="text-2xl font-bold text-heading">
                Register
            </h1>
            <p className="text-muted mt-1 mb-6">
                Create a new TaskItEasy account.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="text" className="block text-sm font-medium text-heading mb-2">Username</label>
                    <input type="text" id="username" className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-heading mb-2">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-heading mb-2">Password</label>
                    <input type="password" id="password" className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent">
                Register
                </button>
            </form>
        </div>
    </div>
  );
}

export default RegisterPage;