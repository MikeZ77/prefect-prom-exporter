import fetch from 'node-fetch';
import _ from 'lodash';
import * as Api from './get-api-template.js';

const config = {
  // ROOT
  HEALTH: Api.healthT,
  VERSION: Api.versionT,
  // FLOWS
  FLOWS_COUNT: Api.flowsCountT,
  FLOWS_FILTER: Api.flowsT,
  // FLOW_RUNS
  FLOW_RUNS_COUNT_SCHEDULED: _.partial(Api.flowRunsStateT, 'SCHEDULED'),
  FLOW_RUNS_COUNT_PENDING: _.partial(Api.flowRunsStateT, 'PENDING'),
  FLOW_RUNS_COUNT_RUNNING: _.partial(Api.flowRunsStateT, 'RUNNING'),
  FLOW_RUNS_COUNT_COMPLETED: _.partial(Api.flowRunsStateT, 'COMPLETED'),
  FLOW_RUNS_COUNT_FAILED: _.partial(Api.flowRunsStateT, 'FAILED'),
  FLOW_RUNS_COUNT_CANCELLED: _.partial(Api.flowRunsStateT, 'CANCELLED'),
  FLOW_RUNS_COUNT_CRASHED: _.partial(Api.flowRunsStateT, 'CRASHED'),
  FLOW_RUNS_COUNT_PAUSED: _.partial(Api.flowRunsStateT, 'PAUSED'),
  FLOW_RUNS_COUNT_CANCELLING: _.partial(Api.flowRunsStateT, 'CANCELLING'),
  FLOW_RUNS_FILTER_START_TIME: Api.flowRunsStartTime,
  FLOW_RUNS_FILTER_ID: Api.flowRunsById,
  // WORK_POOLS
  WORK_POOLS: Api.workPoolsT,
  // LOGS
  LOGS_FILTER: Api.logsFilter,
};

export default async (metric, ...args) => {
  const payload = args.length ? config[metric](...args) : config[metric]();
  const response = await fetch(...Object.values(payload));
  const data = await response.json();
  return data;
};
