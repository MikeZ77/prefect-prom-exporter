import fetch from 'node-fetch';
import _ from 'lodash';
import { PREFECT_API_URL } from './get-env.js';
import { flowRunsStateT } from './get-api-template.js';

const config = {
  // FLOWS
  FLOWS_COUNT: {
    url: `${PREFECT_API_URL}api/flows/count`,
    options: { method: 'POST' },
  },
  FLOWS: {
    url: `${PREFECT_API_URL}api/flows/filter`,
    options: { method: 'POST' },
  },
  // FLOW_RUNS
  FLOW_RUNS_SCHEDULED: _.partial(flowRunsStateT, 'SCHEDULED'),
  FLOW_RUNS_PENDING: _.partial(flowRunsStateT, 'PENDING'),
  FLOW_RUNS_RUNNING: _.partial(flowRunsStateT, 'RUNNING'),
  // FLOW_RUNS_COMPLETED: _.partial(flowRunsStateT, 'COMPLETED'),
  // FLOW_RUNS_FAILED: flowRunsStateT('FAILED'),
  // FLOW_RUNS_CANCELLED: flowRunsStateT('CANCELLED'),
  // FLOW_RUNS_CRASHED: flowRunsStateT('CRASHED'),
  // FLOW_RUNS_PAUSED: flowRunsStateT('PAUSED'),
  // FLOW_RUNS_CANCELLING: flowRunsStateT('CANCELLING'),
};

export default async (metric, ...args) => {
  const payload = args.length ? config[metric](...args) : config[metric];
  const response = await fetch(...Object.values(payload));
  const data = await response.json();
  return data;
};
