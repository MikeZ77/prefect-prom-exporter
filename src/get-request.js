import fetch from 'node-fetch';
import _ from 'lodash';
import * as Api from './get-api-template.js';

const config = {
  // ROOT
  HEALTH: Api.healthT,
  VERSION: Api.versionT,
  // FLOWS
  FLOWS_COUNT: Api.flowsCountT,
  FLOWS: Api.flowsT,
  // FLOW_RUNS
  FLOW_RUNS_SCHEDULED: _.partial(Api.flowRunsStateT, 'SCHEDULED'),
  FLOW_RUNS_PENDING: _.partial(Api.flowRunsStateT, 'PENDING'),
  FLOW_RUNS_RUNNING: _.partial(Api.flowRunsStateT, 'RUNNING'),
  // FLOW_RUNS_COMPLETED: _.partial(flowRunsStateT, 'COMPLETED'),
  // FLOW_RUNS_FAILED: flowRunsStateT('FAILED'),
  // FLOW_RUNS_CANCELLED: flowRunsStateT('CANCELLED'),
  // FLOW_RUNS_CRASHED: flowRunsStateT('CRASHED'),
  // FLOW_RUNS_PAUSED: flowRunsStateT('PAUSED'),
  // FLOW_RUNS_CANCELLING: flowRunsStateT('CANCELLING'),

  // WORK_POOLS
  WORK_POOLS: Api.workPoolsT,
};

export default async (metric, ...args) => {
  const payload = args.length ? config[metric](...args) : config[metric]();
  const response = await fetch(...Object.values(payload));
  const data = await response.json();
  return data;
};
