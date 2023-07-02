import promClient from 'prom-client';
import fetchApi from './get-request.js';

const healthCheck = new promClient.Gauge({
  name: 'prefect_health',
  help: 'prefect server health status which can be healthy~1 or unhealthy~0',
});

const prefectVersion = new promClient.Gauge({
  name: 'prefect_version',
  help: 'current version the prefect server is running on',
  labelNames: ['version'],
});

const fetchHealthCheck = async (sendRequest) => {
  const value = await sendRequest('HEALTH');
  value ? healthCheck.set(1) : healthCheck.set(0);
};

const fetchPrefectVersion = async (sendRequest) => {
  const value = await sendRequest('VERSION');
  prefectVersion.labels({ version: value }).set(1);
};

export default async () => [fetchHealthCheck(fetchApi), fetchPrefectVersion(fetchApi)];
