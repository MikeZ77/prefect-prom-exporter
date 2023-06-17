import promClient from 'prom-client';
import _ from 'lodash';
import fetchApi from './get-request.js';

const flowsCount = new promClient.Gauge({
  name: 'prefect_flows',
  help: 'Prefect flows total count based on tag and work_pool',
  // labelNames: ['tags'],
});

export const fetchFlowsCount = async () => {
  const data = await fetchApi('FLOWS_COUNT');
  flowsCount.set(data);
};

export const fetchFlowLabels = async (metricsFunc) => {
  const data = await fetchApi('FLOWS');
  const flowLabels = _.map(data, (flow) => ({ name: flow.name, tags: flow.tags }));
  return metricsFunc(flowLabels);
};
