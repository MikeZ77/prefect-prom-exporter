import promClient from 'prom-client';
import _ from 'lodash';
import fetchApi from './get-request.js';

/* TODO: Complete for the remaining states:
'SCHEDULED', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'CRASHED', 'PAUSED', 'CANCELLING' */

const flowRunsScheduled = new promClient.Gauge({
  name: 'prefect_total_flow_runs_scheduled',
  help: 'current number of prefect flow runs scheduled',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsPending = new promClient.Gauge({
  name: 'prefect_current_flow_runs_pending',
  help: 'current number of prefect flow runs pending',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsRunning = new promClient.Gauge({
  name: 'prefect_current_flow_runs_running',
  help: 'current number of prefect flow runs running',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsPaused = new promClient.Gauge({
  name: 'prefect_current_flow_runs_paused',
  help: 'current number of prefect flow runs paused',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCancelling = new promClient.Gauge({
  name: 'prefect_current_flow_runs_cancelling',
  help: 'current number of prefect flow runs cancelling',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCompleted = new promClient.Counter({
  name: 'prefect_total_flow_runs_completed',
  help: 'total number of prefect flow runs completed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsFailed = new promClient.Counter({
  name: 'prefect_total_flow_runs_failed',
  help: 'total number of prefect flow runs failed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCancelled = new promClient.Counter({
  name: 'prefect_total_flow_runs_cancelled',
  help: 'total number of prefect flow runs cancelled',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCrashed = new promClient.Counter({
  name: 'prefect_total_flow_runs_crashed',
  help: 'total number of prefect flow runs crashed',
  labelNames: ['flow_name', 'tags'],
});

const fetchFlowRunsScheduled = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_SCHEDULED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsScheduled.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchFlowRunsPending = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_PENDING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsPending.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchFlowRunsRunning = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_RUNNING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsRunning.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchFlowRunsPaused = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_PAUSED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsPaused.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchFlowRunsCancelling = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_CANCELLING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsCancelling.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchFlowRunsCompleted = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_COMPLETED', labels.name)));
  const metrics = await promClient.register.getSingleMetric('prefect_total_flow_runs_completed');
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    const delta = value - _.get(metrics, `hashMap.flow_name:${labels.name},tags:${labels.tags.toString()}.value`, 0);
    flowRunsCompleted.labels({ flow_name: labels.name, tags: labels.tags.toString() }).inc(delta);
  });
};

const fetchFlowRunsFailed = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_FAILED', labels.name)));
  const metrics = await promClient.register.getSingleMetric('prefect_total_flow_runs_failed');
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    const delta = value - _.get(metrics, `hashMap.flow_name:${labels.name},tags:${labels.tags.toString()}.value`, 0);
    flowRunsFailed.labels({ flow_name: labels.name, tags: labels.tags.toString() }).inc(delta);
  });
};

const fetchFlowRunsCancelled = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_CANCELLED', labels.name)));
  const metrics = await promClient.register.getSingleMetric('prefect_total_flow_runs_cancelled');
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    const delta = value - _.get(metrics, `hashMap.flow_name:${labels.name},tags:${labels.tags.toString()}.value`, 0);
    flowRunsCancelled.labels({ flow_name: labels.name, tags: labels.tags.toString() }).inc(delta);
  });
};

const fetchFlowRunsCrashed = async (flowLabels) => {
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_CRASHED', labels.name)));
  const metrics = await promClient.register.getSingleMetric('prefect_total_flow_runs_crashed');
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    const delta = value - _.get(metrics, `hashMap.flow_name:${labels.name},tags:${labels.tags.toString()}.value`, 0);
    flowRunsCrashed.labels({ flow_name: labels.name, tags: labels.tags.toString() }).inc(delta);
  });
};

const currentFlowRunsCompleted = new promClient.Gauge({
  name: 'prefect_flow_runs_scheduled_current',
  help: 'current number of prefect flow runs scheduled',
  labelNames: ['tags'],
});

const fetchCurrentFlowRunsCompleted = (flowRuns) => {
  console.log('flowRuns', flowRuns);
  const completedFlowRuns = _.filter(flowRuns, (flow) => _.includes('COMPLETED', flow.state_type));
  _.forEach(completedFlowRuns, (flow) => currentFlowRunsCompleted.labels({ tags: flow.tags }).set(1));
};

export default async (fetchFlowLabels, flowRuns) => [
  fetchFlowLabels(fetchFlowRunsScheduled),
  fetchFlowLabels(fetchFlowRunsPending),
  fetchFlowLabels(fetchFlowRunsRunning),
  fetchFlowLabels(fetchFlowRunsCompleted),
  fetchFlowLabels(fetchFlowRunsFailed),
  fetchFlowLabels(fetchFlowRunsCancelled),
  fetchFlowLabels(fetchFlowRunsCrashed),
  fetchFlowLabels(fetchFlowRunsPaused),
  fetchFlowLabels(fetchFlowRunsCancelling),
  fetchCurrentFlowRunsCompleted(flowRuns),
];
