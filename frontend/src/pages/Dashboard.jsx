import DeploymentForm from '../components/DeploymentForm.jsx';
import DeploymentList from '../components/DeploymentList.jsx';

export default function Dashboard({ deployments, onSubmit }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DeploymentForm onSubmit={onSubmit} />
      <DeploymentList deployments={deployments} />
    </div>
  );
}
