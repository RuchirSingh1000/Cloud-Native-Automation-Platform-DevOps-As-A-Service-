import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { fetchDeployments, login, submitDeployment } from './api/client.js';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [deployments, setDeployments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchDeployments(token).then(setDeployments).catch((err) => setError(err.message));
  }, [token]);

  const handleLogin = async (payload) => {
    try {
      const data = await login(payload);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeployment = async (payload) => {
    try {
      await submitDeployment(payload, token);
      const data = await fetchDeployments(token);
      setDeployments(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {error && <div className="rounded bg-rose-600/20 p-3 text-rose-200">{error}</div>}
        {!token ? <LoginForm onLogin={handleLogin} /> : <Dashboard deployments={deployments} onSubmit={handleDeployment} />}
      </div>
    </main>
  );
}
