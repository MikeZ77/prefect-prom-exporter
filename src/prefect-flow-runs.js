import promClient from 'prom-client';
import _ from 'lodash';
import stateManager from './state.js';
import { PREFECT_FLOW_RUN_BUCKETS } from './get-env.js';

const flowRunCountCounter = new promClient.Counter({
  name: 'prefect_flow_run_count_total',
  help: 'total number of prefect flow runs',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunCountGauge = new promClient.Gauge({
  name: 'prefect_flow_run_count',
  help: 'current number of prefect flow runs',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEndTimeCount = new promClient.Counter({
  name: 'prefect_flow_run_time_total',
  help: 'total time taken for a finished pefect flow run in seconds',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEstimatedRunTimeCount = new promClient.Counter({
  name: 'prefect_flow_run_estimated_time_total',
  help: 'total estimated time taken by prefect for a finished pefect flow run in seconds',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEndTimeHist = new promClient.Histogram({
  name: 'prefect_flow_run_cummulative_time_total',
  help: 'cummulative distribution of prefect_flow_run_time_total',
  buckets: PREFECT_FLOW_RUN_BUCKETS,
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEstimatedRunTimeHist = new promClient.Histogram({
  name: 'prefect_flow_run_cummulative_estimated_time_total',
  help: 'cummulative distribution of prefect_flow_run_estimated_time_total',
  buckets: PREFECT_FLOW_RUN_BUCKETS,
  labelNames: ['flow_name', 'flow_name', 'tags', 'state'],
});

const flowRunManualTriggerCount = new promClient.Counter({
  name: 'prefect_flow_run_manual_trigger_count_total',
  help: 'a manual flow run has been triggered and has finished',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEstimatedStartTimeDeltaCount = new promClient.Counter({
  name: 'prefect_flow_run_estimated_time_delta_total',
  help: 'the difference between a flow runs actual start time and its expected start time',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunEstimatedStartTimeDeltaHist = new promClient.Histogram({
  name: 'prefect_flow_run_cummulative_time_delta_total',
  help: 'cummulative distribution of prefect_flow_run_estimated_time_delta_total',
  buckets: PREFECT_FLOW_RUN_BUCKETS,
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunCurrentTimeCount = new promClient.Counter({
  name: 'prefect_flow_run_active_time_total',
  help: 'total time taken for prefect flow runs while in an active state',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunCurrentTimeGauge = new promClient.Gauge({
  name: 'prefect_current_active_flow_run_time_ms',
  help: 'current time taken for prefect flow runs while in an active state',
  labelNames: ['flow_name', 'tags', 'state'],
});

const flowRunsCountTotal = () => {
  const { getFlowRuns, constructLabels } = stateManager;
  console.log(getFlowRuns());
  _.forEach(getFlowRuns(), (flowRun) => {
    if (flowRun.updated_state) {
      flowRunCountCounter.labels(constructLabels(flowRun)).inc(1);
    }
  });
};

const flowRunsCount = () => {
  _.forEach(stateManager.getFlowRunsCount(), (flowRun) => {
    const { count, ...labels } = flowRun;
    flowRunCountGauge.labels(labels).set(count);
  });
};

const flowRunTime = () => {
  const { getFlowRuns, getTerminalStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getTerminalStates(), flowRun.state_type)).forEach((flowRun) =>
    flowRunEndTimeCount.labels(constructLabels(flowRun)).inc(Math.round(flowRun.total_run_time)),
  );
};

const flowRunEstimatedRunTime = () => {
  const { getFlowRuns, getTerminalStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getTerminalStates(), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedRunTimeCount.labels(constructLabels(flowRun)).inc(Math.round(flowRun.estimated_run_time)),
  );
};

const flowRunCummulativeEndTime = () => {
  const { getFlowRuns, getTerminalStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getTerminalStates(), flowRun.state_type)).forEach((flowRun) =>
    flowRunEndTimeHist.labels(constructLabels(flowRun)).observe(Math.round(flowRun.total_run_time)),
  );
};

const flowRunCummulativeEstimatedRunTime = () => {
  const { getFlowRuns, getTerminalStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getTerminalStates(), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedRunTimeHist.labels(constructLabels(flowRun)).observe(Math.round(flowRun.estimated_run_time)),
  );
};

const flowRunManualTrigger = () => {
  const { getFlowRuns, getTerminalStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getTerminalStates(), flowRun.state_type)).forEach((flowRun) => {
    if (!flowRun.auto_scheduled) {
      flowRunManualTriggerCount.labels(constructLabels(flowRun)).inc(1);
    }
  });
};

const flowRunEstimatedStartTimeDelta = () => {
  const { getFlowRuns, getTerminalStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getTerminalStates(), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedStartTimeDeltaCount
      .labels(constructLabels(flowRun))
      .inc(Math.round(flowRun.estimated_start_time_delta)),
  );
};

const flowRunCummulativeEstimatedStartTimeDelta = () => {
  const { getFlowRuns, getTerminalStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getTerminalStates(), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedStartTimeDeltaHist
      .labels(constructLabels(flowRun))
      .observe(Math.round(flowRun.estimated_start_time_delta)),
  );
};

const flowRunTimeActiveTotal = () => {
  const { getActiveStates, getFlowRuns, constructLabels } = stateManager;
  const currentTime = new Date();
  _.filter(getFlowRuns(), (flowRun) => _.includes(getActiveStates(), flowRun.state_type)).forEach((flowRun) => {
    flowRunCurrentTimeCount
      .labels(constructLabels(flowRun))
      .inc(currentTime.getTime() - new Date(flowRun.current_time));
  });
};

const flowRunTimeActive = () => {
  const { getTerminalStates, getActiveStates, getFlowRuns, constructLabels } = stateManager;
  _.forEach(getFlowRuns(), (flowRun) => {
    if (_.includes(getTerminalStates(), flowRun.state_type)) {
      flowRunCurrentTimeGauge
        .labels(constructLabels(flowRun))
        .dec(new Date(flowRun.current_time) - new Date(flowRun.start_time));
    }

    if (_.includes(getActiveStates(), flowRun.state_type)) {
      flowRunCurrentTimeGauge
        .labels(constructLabels(flowRun))
        .set(new Date(flowRun.current_time) - new Date(flowRun.start_time));
    }
  });
};

export { flowRunsCountTotal };

export default async () => [
  flowRunsCount(),
  flowRunsCountTotal(),
  flowRunTime,
  flowRunEstimatedRunTime(),
  flowRunCummulativeEndTime(),
  flowRunCummulativeEstimatedRunTime(),
  flowRunManualTrigger(),
  flowRunEstimatedStartTimeDelta(),
  flowRunCummulativeEstimatedStartTimeDelta(),
  flowRunTimeActiveTotal(),
  flowRunTimeActive(),
];
