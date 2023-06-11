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

export const fetchFlows = async () => {
  const data = await fetchApi('FLOWS');
  return _.uniq(_.map(data, 'name'));
};
