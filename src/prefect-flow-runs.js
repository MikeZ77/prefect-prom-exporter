import promClient from 'prom-client';
import _ from 'lodash';
import fetchApi from './get-request.js';

/* TODO: Complete for the remaining states:
'SCHEDULED', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'CRASHED', 'PAUSED', 'CANCELLING' */

const flowRunsScheduled = new promClient.Gauge({
  name: 'prefect_flow_runs_scheduled',
  help: 'Prefect flow runs scheduled count based on tag and work_pool',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsPending = new promClient.Gauge({
  name: 'prefect_flow_runs_pending',
  help: 'Prefect flow runs pending count based on tag and work_pool',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsRunning = new promClient.Gauge({
  name: 'prefect_flow_runs_running',
  help: 'Prefect flow runs running count based on tag and work_pool',
  labelNames: ['flow_name', 'tags'],
});

const fetchFlowRunsScheduled = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_SCHEDULED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) =>
    flowRunsScheduled.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value),
  );
};

const fetchFlowRunsPending = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_PENDING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) =>
    flowRunsPending.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value),
  );
};

const fetchFlowRunsRunning = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_RUNNING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) =>
    flowRunsRunning.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value),
  );
};

export default async (fetchFlowLabels) => [
  fetchFlowLabels(fetchFlowRunsScheduled),
  fetchFlowLabels(fetchFlowRunsPending),
  fetchFlowLabels(fetchFlowRunsRunning),
];
