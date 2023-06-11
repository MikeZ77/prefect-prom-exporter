import promClient from 'prom-client';
import _ from 'lodash';
import fetchApi from './get-request.js';

/* TODO: Complete for the remaining states:
'SCHEDULED', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'CRASHED', 'PAUSED', 'CANCELLING' */

const flowRunsScheduled = new promClient.Gauge({
  name: 'prefect_flow_runs_scheduled',
  help: 'Prefect flow runs scheduled count based on tag and work_pool',
  labelNames: ['flow_name'],
});

const flowRunsPending = new promClient.Gauge({
  name: 'prefect_flow_runs_pending',
  help: 'Prefect flow runs pending count based on tag and work_pool',
  labelNames: ['flow_name'],
});

const flowRunsRunning = new promClient.Gauge({
  name: 'prefect_flow_runs_running',
  help: 'Prefect flow runs running count based on tag and work_pool',
  labelNames: ['flow_name'],
});

export const fetchFlowRunsScheduled = async (flowNames) => {
  const data = await Promise.all(_.map(flowNames, name => fetchApi('FLOW_RUNS_SCHEDULED', name)));
  _.forEach(_.zip(flowNames, data), ([name, value]) => flowRunsScheduled.labels({ flow_name: name }).set(value));
};

export const fetchFlowRunsPending = async (flowNames) => {
  const data = await Promise.all(_.map(flowNames, name => fetchApi('FLOW_RUNS_PENDING', name)));
  _.forEach(_.zip(flowNames, data), ([name, value]) => flowRunsPending.labels({ flow_name: name }).set(value));
};

export const fetchFlowRunsRunning = async (flowNames) => {
  const data = await Promise.all(_.map(flowNames, name => fetchApi('FLOW_RUNS_RUNNING', name)));
  _.forEach(_.zip(flowNames, data), ([name, value]) => flowRunsRunning.labels({ flow_name: name }).set(value));
};
