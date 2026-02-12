import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function generateGithubActions(repoPath, imageName) {
  const workflowDir = path.join(repoPath, '.github', 'workflows');
  await mkdir(workflowDir, { recursive: true });

  const workflow = `name: CI/CD Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: docker build -t ${imageName}:\${{ github.sha }} .
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: \${{ secrets.AWS_REGION }}
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - run: |
          aws ecr get-login-password --region \${{ secrets.AWS_REGION }} | docker login --username AWS --password-stdin \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com
          docker tag ${imageName}:\${{ github.sha }} \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/${imageName}:\${{ github.sha }}
          docker push \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/${imageName}:\${{ github.sha }}
      - run: echo "Deploy using Terraform/EKS/EC2 strategy"
`;

  const destination = path.join(workflowDir, 'deploy.yml');
  await writeFile(destination, workflow, 'utf-8');
  return destination;
}
