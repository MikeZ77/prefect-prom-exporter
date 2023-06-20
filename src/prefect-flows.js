import promClient from 'prom-client';
import fetchApi from './get-request.js';

const flowsCount = new promClient.Gauge({
  name: 'prefect_flows',
  help: 'Prefect flows total count based on tag and work_pool',
  // labelNames: ['tags'],
});

// eslint-disable-next-line import/prefer-default-export
export const fetchFlowsCount = async () => {
  const data = await fetchApi('FLOWS_COUNT');
  flowsCount.set(data);
};
