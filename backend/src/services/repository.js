import { mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import simpleGit from 'simple-git';

const githubUrlPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?$/i;

export function validateGitHubUrl(url) {
  return githubUrlPattern.test(url);
}

export async function cloneRepository(repoUrl, workspaceRoot = 'workspace/repos') {
  const repoName = repoUrl.split('/').slice(-2).join('/').replace('.git', '').replace('/', '-');
  const targetPath = path.resolve(workspaceRoot, repoName);

  await mkdir(workspaceRoot, { recursive: true });

  try {
    await access(targetPath, constants.F_OK);
    return targetPath;
  } catch {
    const git = simpleGit();
    await git.clone(repoUrl, targetPath);
    return targetPath;
  }
}
