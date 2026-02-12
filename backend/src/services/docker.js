import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const defaultDockerfile = `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
`;

export async function ensureDockerfile(repoPath) {
  const dockerfilePath = path.join(repoPath, 'Dockerfile');
  try {
    await access(dockerfilePath, constants.F_OK);
    return { created: false, dockerfile: await readFile(dockerfilePath, 'utf-8') };
  } catch {
    await writeFile(dockerfilePath, defaultDockerfile, 'utf-8');
    return { created: true, dockerfile: defaultDockerfile };
  }
}

export async function buildDockerImage(repoPath, imageName) {
  const { stdout, stderr } = await execAsync(`docker build -t ${imageName} .`, { cwd: repoPath });
  return { stdout, stderr };
}
