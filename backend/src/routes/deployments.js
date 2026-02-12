import { z } from 'zod';
import { pool } from '../db/client.js';
import { validateGitHubUrl, cloneRepository } from '../services/repository.js';
import { ensureDockerfile, buildDockerImage } from '../services/docker.js';
import { provisionAwsInfrastructure } from '../services/infra.js';
import { generateGithubActions } from '../services/cicd.js';
import { generateMonitoringStack } from '../services/monitoring.js';

const deploymentSchema = z.object({
  repositoryUrl: z.string().url(),
  infraTarget: z.enum(['ec2', 'eks']).default('ec2')
});

export async function deploymentRoutes(app) {
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const parsed = deploymentSchema.safeParse(request.body);
    if (!parsed.success) return reply.badRequest(parsed.error.flatten());

    const { repositoryUrl, infraTarget } = parsed.data;
    if (!validateGitHubUrl(repositoryUrl)) {
      return reply.badRequest('Only valid GitHub repository URLs are allowed');
    }

    const imageName = repositoryUrl.split('/').pop().replace('.git', '').toLowerCase();
    const userId = Number(request.user.sub);

    const inserted = await pool.query(
      'INSERT INTO deployments (user_id, repository_url, status, image_name, infra_target) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, repositoryUrl, 'in_progress', imageName, infraTarget]
    );

    const deployment = inserted.rows[0];

    try {
      const repoPath = await cloneRepository(repositoryUrl);
      const dockerfile = await ensureDockerfile(repoPath);
      await generateGithubActions(repoPath, imageName);
      await generateMonitoringStack();
      const dockerBuild = await buildDockerImage(repoPath, imageName);
      const infra = await provisionAwsInfrastructure(infraTarget);

      await pool.query('UPDATE deployments SET status = $1, logs = $2 WHERE id = $3', [
        'completed',
        JSON.stringify({ dockerfile, dockerBuild, infra }),
        deployment.id
      ]);

      return { ...deployment, status: 'completed' };
    } catch (error) {
      await pool.query('UPDATE deployments SET status = $1, logs = $2 WHERE id = $3', [
        'failed',
        String(error),
        deployment.id
      ]);
      return reply.internalServerError({ message: 'Deployment failed', error: String(error) });
    }
  });

  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const result = await pool.query('SELECT * FROM deployments WHERE user_id = $1 ORDER BY created_at DESC', [
      Number(request.user.sub)
    ]);
    return result.rows;
  });
}
