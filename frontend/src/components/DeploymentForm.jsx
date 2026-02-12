import { useState } from 'react';

export default function DeploymentForm({ onSubmit }) {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [infraTarget, setInfraTarget] = useState('ec2');

  return (
    <form className="rounded-xl bg-slate-900 p-6" onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ repositoryUrl, infraTarget });
      setRepositoryUrl('');
    }}>
      <h2 className="mb-4 text-lg font-semibold text-white">New Deployment</h2>
      <input className="mb-3 w-full rounded bg-slate-800 p-2 text-white" placeholder="https://github.com/owner/repo" value={repositoryUrl} onChange={(e) => setRepositoryUrl(e.target.value)} />
      <select className="mb-3 w-full rounded bg-slate-800 p-2 text-white" value={infraTarget} onChange={(e) => setInfraTarget(e.target.value)}>
        <option value="ec2">AWS EC2</option>
        <option value="eks">AWS EKS</option>
      </select>
      <button className="rounded bg-emerald-500 px-4 py-2 font-medium text-slate-950">Deploy</button>
    </form>
  );
}
