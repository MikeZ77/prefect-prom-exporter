import promClient from 'prom-client';
import fetchApi from './get-request.js';

const healthCheck = new promClient.Gauge({
  name: 'prefect_health',
  help: 'Prefect health status which can be healthy (1) or unhealthy (0)',
});

const prefectVersion = new promClient.Gauge({
  name: 'prefect_version',
  help: 'Prefect server version',
  labelNames: ['version'],
});

export const fetchHealthCheck = async () => {
  const value = await fetchApi('HEALTH');
  if (value === 'true') {
    healthCheck.set(1);
  } else {
    healthCheck.set(0);
  }
};

export const fetchPrefectVersion = async () => {
  const value = await fetchApi('VERSION');
  prefectVersion.labels({ version: value }).set(1);
};
