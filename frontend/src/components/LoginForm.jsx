import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <form className="space-y-3 rounded-xl bg-slate-900 p-6" onSubmit={(e) => {
      e.preventDefault();
      onLogin(form);
    }}>
      <h1 className="text-xl font-semibold text-white">DevOps as a Service</h1>
      <input className="w-full rounded bg-slate-800 p-2 text-white" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full rounded bg-slate-800 p-2 text-white" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="w-full rounded bg-cyan-500 p-2 font-medium text-slate-950" type="submit">Sign In</button>
    </form>
  );
}
