import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function generateMonitoringStack(targetDir = 'infra/monitoring') {
  await mkdir(targetDir, { recursive: true });

  const prometheus = `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  - job_name: 'app_health'
    metrics_path: /api/health
    static_configs:
      - targets: ['host.docker.internal:8080']
`;

  const compose = `version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - '9100:9100'
`;

  await writeFile(path.join(targetDir, 'prometheus.yml'), prometheus, 'utf-8');
  await writeFile(path.join(targetDir, 'docker-compose.yml'), compose, 'utf-8');
}
