import promClient from 'prom-client';
import _ from 'lodash';
import fetchApi from './get-request.js';
import stateManager from './state.js';

/* TODO: Complete for the remaining states:
'SCHEDULED', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'CRASHED', 'PAUSED', 'CANCELLING' */

const flowRunsScheduledGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_scheduled',
  help: 'current number of prefect flow runs scheduled',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsPendingGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_pending',
  help: 'current number of prefect flow runs pending',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsRunningGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_running',
  help: 'current number of prefect flow runs running',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsPausedGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_paused',
  help: 'current number of prefect flow runs paused',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCancellingGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_cancelling',
  help: 'current number of prefect flow runs cancelling',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCompletedGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_completed',
  help: 'total number of prefect flow runs completed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsFailedGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_failed',
  help: 'total number of prefect flow runs failed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCancelledGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_cancelled',
  help: 'total number of prefect flow runs cancelled',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCrashedGauge = new promClient.Gauge({
  name: 'prefect_current_flow_runs_crashed',
  help: 'total number of prefect flow runs crashed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCompletedCount = new promClient.Counter({
  name: 'prefect_total_flow_runs_completed',
  help: 'total number of prefect flow runs completed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsFailedCount = new promClient.Counter({
  name: 'prefect_total_flow_runs_failed',
  help: 'total number of prefect flow runs failed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsRunningCount = new promClient.Counter({
  name: 'prefect_total_flow_runs_running',
  help: 'total number of prefect flow runs running',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCancelledCount = new promClient.Counter({
  name: 'prefect_total_flow_runs_cancelled',
  help: 'total number of prefect flow runs cancelled',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsCrashedCount = new promClient.Counter({
  name: 'prefect_total_flow_runs_crashed',
  help: 'total number of prefect flow runs crashed',
  labelNames: ['flow_name', 'tags'],
});

const flowRunsPausedCount = new promClient.Counter({
  name: 'prefect_total_flow_runs_paused',
  help: 'total number of prefect flow runs paused',
  labelNames: ['flow_name', 'tags'],
});

const fetchCurrentFlowRunsScheduled = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_SCHEDULED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsScheduledGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsPending = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_PENDING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsPendingGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsRunning = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_RUNNING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsRunningGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsPaused = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_PAUSED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsPausedGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsCancelling = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_CANCELLING', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsCancellingGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsCompleted = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_COMPLETED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsCompletedGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsFailed = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_FAILED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsFailedGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsCancelled = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_CANCELLED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsCancelledGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

const fetchCurrentFlowRunsCrashed = async () => {
  const flowLabels = stateManager.getFlowLabels();
  const data = await Promise.all(_.map(flowLabels, (labels) => fetchApi('FLOW_RUNS_COUNT_CRASHED', labels.name)));
  _.forEach(_.zip(flowLabels, data), ([labels, value]) => {
    flowRunsCrashedGauge.labels({ flow_name: labels.name, tags: labels.tags.toString() }).set(value);
  });
};

// TODO: Retrieve flow name and add to label
const fetchTotalFlowRunsCompleted = () => {
  const flowRuns = stateManager.getFlowRuns();
  const completedFlowRuns = _.filter(flowRuns, (flow) => _.includes('COMPLETED', flow.state_type));
  _.forEach(completedFlowRuns, (flow) =>
    flowRunsCompletedCount.labels({ flow_name: flow.flow_name, tags: flow.tags.toString() }).inc(1),
  );
};

const fetchTotalFlowRunsFailed = () => {
  const flowRuns = stateManager.getFlowRuns();
  const failedFlowRuns = _.filter(flowRuns, (flow) => _.includes('FAILED', flow.state_type));
  _.forEach(failedFlowRuns, (flow) =>
    flowRunsFailedCount.labels({ flow_name: flow.flow_name, tags: flow.tags.toString() }).inc(1),
  );
};

const fetchTotalFlowRunsRunning = () => {
  const flowRuns = stateManager.getFlowRuns();
  const runningFlowRuns = _.filter(flowRuns, (flow) => _.includes('RUNNING', flow.state_type));
  _.forEach(runningFlowRuns, (flow) =>
    flowRunsRunningCount.labels({ flow_name: flow.flow_name, tags: flow.tags.toString() }).inc(1),
  );
};

const fetchTotalFlowRunsCancelled = () => {
  const flowRuns = stateManager.getFlowRuns();
  const cancelledFlowRuns = _.filter(flowRuns, (flow) => _.includes('CANCELLED', flow.state_type));
  _.forEach(cancelledFlowRuns, (flow) =>
    flowRunsCancelledCount.labels({ flow_name: flow.flow_name, tags: flow.tags.toString() }).inc(1),
  );
};

const fetchTotalFlowRunsCrashed = () => {
  const flowRuns = stateManager.getFlowRuns();
  const crashedFlowRuns = _.filter(flowRuns, (flow) => _.includes('CRASHED', flow.state_type));
  _.forEach(crashedFlowRuns, (flow) =>
    flowRunsCrashedCount.labels({ flow_name: flow.flow_name, tags: flow.tags.toString() }).inc(1),
  );
};

const fetchTotalFlowRunsPaused = () => {
  const flowRuns = stateManager.getFlowRuns();
  const pausedFlowRuns = _.filter(flowRuns, (flow) => _.includes('PAUSED', flow.state_type));
  _.forEach(pausedFlowRuns, (flow) =>
    flowRunsPausedCount.labels({ flow_name: flow.flow_name, tags: flow.tags.toString() }).inc(1),
  );
};

const flowRunTimeCount = new promClient.Counter({
  name: 'prefect_total_flow_run_time_ms',
  help: 'total time taken for prefect flow runs in milliseconds',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEstimatedTimeCount = new promClient.Counter({
  name: 'prefect_total_flow_run_estimated_time_ms',
  help: 'total estimated time taken for prefect flow runs in milliseconds',
  labelNames: ['flow_name', 'tags', 'state'],
});

// TODO: make the buckets configurable
const flowRunTimeHist = new promClient.Histogram({
  name: 'prefect_distribution_flow_run_time_ms',
  help: 'the distribution of prefect flow run times in milliseconds',
  buckets: [0, 500, 1000, 5000, 10000, 20000],
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEstimatedTimeHist = new promClient.Histogram({
  name: 'prefect_distribution_flow_run_estimated_time_ms',
  help: 'the distribution of prefect flow run times in milliseconds',
  buckets: [0, 500, 1000, 5000, 10000, 20000],
  labelNames: ['flow_name', 'flow_name', 'tags', 'state'],
});

const flowRunManualTriggerCount = new promClient.Counter({
  name: 'prefect_total_flow_run_manual',
  help: 'a manual flow run has been triggered and has finished',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEstimatedStartTimeDelta = new promClient.Counter({
  name: 'prefect_total_flow_run_start_time_delta_ms',
  help: 'the difference between a flows runs actual start time and its exprected start time in milliseconds',
  labelNames: ['flow_name', 'tags', 'state'],
});

const fetchTotalFlowRunTime = () => {
  const terminalStates = stateManager.getTerminalStates();
  const flowRuns = _.filter(stateManager.getFlowRuns(), (flow) => _.includes(terminalStates, flow.state_type));
  _.forEach(flowRuns, (flow) =>
    flowRunTimeCount
      .labels({ tags: flow.tags.toString(), state: flow.state_type })
      .inc(Math.round(1000 * flow.total_run_time)),
  );
};

const fetchTotalFlowRunStartTimeDelta = () => {
  const terminalStates = stateManager.getTerminalStates();
  const flowRuns = _.filter(stateManager.getFlowRuns(), (flow) => _.includes(terminalStates, flow.state_type));
  _.forEach(flowRuns, (flow) =>
    flowRunEstimatedStartTimeDelta
      .labels({ flow_name: flow.flow_name, tags: flow.tags.toString(), state: flow.state_type })
      .inc(Math.round(1000 * flow.estimated_start_time_delta)),
  );
};

const fetchTotalFlowRunEstimatedTime = () => {
  const terminalStates = stateManager.getTerminalStates();
  const flowRuns = _.filter(stateManager.getFlowRuns(), (flow) => _.includes(terminalStates, flow.state_type));
  _.forEach(flowRuns, (flow) =>
    flowRunEstimatedTimeCount
      .labels({ flow_name: flow.flow_name, tags: flow.tags.toString(), state: flow.state_type })
      .inc(Math.round(1000 * flow.estimated_run_time)),
  );
};

const fetchHistFlowRunTime = () => {
  const terminalStates = stateManager.getTerminalStates();
  const flowRuns = _.filter(stateManager.getFlowRuns(), (flow) => _.includes(terminalStates, flow.state_type));
  _.forEach(flowRuns, (flow) =>
    flowRunTimeHist
      .labels({ flow_name: flow.flow_name, tags: flow.tags.toString(), state: flow.state_type })
      .observe(Math.round(1000 * flow.total_run_time)),
  );
};

const fetchHistFlowRunEstimatedTime = () => {
  const terminalStates = stateManager.getTerminalStates();
  const flowRuns = _.filter(stateManager.getFlowRuns(), (flow) => _.includes(terminalStates, flow.state_type));
  _.forEach(flowRuns, (flow) =>
    flowRunEstimatedTimeHist
      .labels({ flow_name: flow.flow_name, tags: flow.tags.toString(), state: flow.state_type })
      .observe(Math.round(1000 * flow.total_run_time)),
  );
};

const fetchFlowRunManualTrigger = () => {
  const terminalStates = stateManager.getTerminalStates();
  const flowRuns = _.filter(stateManager.getFlowRuns(), (flow) => _.includes(terminalStates, flow.state_type));
  _.forEach(flowRuns, (flow) => {
    if (!flow.auto_scheduled) {
      flowRunManualTriggerCount
        .labels({ flow_name: flow.flow_name, tags: flow.tags.toString(), state: flow.state_type })
        .inc(Math.round(1000 * flow.total_run_time));
    }
  });
};

export default async () => [
  fetchCurrentFlowRunsScheduled(),
  fetchCurrentFlowRunsPending(),
  fetchCurrentFlowRunsRunning(),
  fetchCurrentFlowRunsCompleted(),
  fetchCurrentFlowRunsFailed(),
  fetchCurrentFlowRunsCancelled(),
  fetchCurrentFlowRunsCrashed(),
  fetchCurrentFlowRunsPaused(),
  fetchCurrentFlowRunsCancelling(),
  fetchTotalFlowRunsCompleted(),
  fetchTotalFlowRunsFailed(),
  fetchTotalFlowRunsRunning(),
  fetchTotalFlowRunsCancelled(),
  fetchTotalFlowRunsCrashed(),
  fetchTotalFlowRunsPaused(),
  fetchTotalFlowRunTime(),
  fetchTotalFlowRunEstimatedTime(),
  fetchHistFlowRunTime(),
  fetchHistFlowRunEstimatedTime(),
  fetchFlowRunManualTrigger(),
  fetchTotalFlowRunStartTimeDelta(),
];
