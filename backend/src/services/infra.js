import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execAsync = promisify(exec);

export async function provisionAwsInfrastructure(target = 'ec2') {
  const terraformDir = path.resolve('infra/terraform');
  const vars = `-var=deployment_target=${target}`;

  const init = await execAsync('terraform init -input=false', { cwd: terraformDir });
  const apply = await execAsync(`terraform apply -auto-approve ${vars}`, { cwd: terraformDir });

  return { init: init.stdout, apply: apply.stdout };
}
