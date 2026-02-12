export default function DeploymentList({ deployments }) {
  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Deployment History</h2>
      <ul className="space-y-3">
        {deployments.map((item) => (
          <li className="rounded bg-slate-800 p-3 text-sm text-slate-100" key={item.id}>
            <p><span className="font-semibold">Repo:</span> {item.repository_url}</p>
            <p><span className="font-semibold">Status:</span> {item.status}</p>
            <p><span className="font-semibold">Target:</span> {item.infra_target}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
