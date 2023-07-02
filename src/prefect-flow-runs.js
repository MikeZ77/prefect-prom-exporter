import promClient from 'prom-client';
import _ from 'lodash';
import stateManager from './state.js';
import { PREFECT_FLOW_RUN_BUCKETS } from './get-env.js';

export const flowRunCountCounter = new promClient.Counter({
  name: 'prefect_flow_run_count_total',
  help: 'total number of prefect flow runs',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunCountGauge = new promClient.Gauge({
  name: 'prefect_flow_run_count',
  help: 'current number of prefect flow runs',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunEndTimeCount = new promClient.Counter({
  name: 'prefect_flow_run_time_total',
  help: 'total time taken for a finished pefect flow run in seconds',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunEstimatedRunTimeCount = new promClient.Counter({
  name: 'prefect_flow_run_estimated_time_total',
  help: 'total estimated time taken by prefect for a finished pefect flow run in seconds',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunEndTimeHist = new promClient.Histogram({
  name: 'prefect_flow_run_cummulative_time_total',
  help: 'cummulative distribution of prefect_flow_run_time_total',
  buckets: PREFECT_FLOW_RUN_BUCKETS,
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunEstimatedRunTimeHist = new promClient.Histogram({
  name: 'prefect_flow_run_cummulative_estimated_time_total',
  help: 'cummulative distribution of prefect_flow_run_estimated_time_total',
  buckets: PREFECT_FLOW_RUN_BUCKETS,
  labelNames: ['flow_name', 'flow_name', 'tags', 'state'],
});

export const flowRunManualTriggerCount = new promClient.Counter({
  name: 'prefect_flow_run_manual_trigger_count_total',
  help: 'a manual flow run has been triggered and has finished',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunEstimatedStartTimeDeltaCount = new promClient.Counter({
  name: 'prefect_flow_run_estimated_time_delta_total',
  help: 'the difference between a flow runs actual start time and its expected start time',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunEstimatedStartTimeDeltaHist = new promClient.Histogram({
  name: 'prefect_flow_run_cummulative_time_delta_total',
  help: 'cummulative distribution of prefect_flow_run_estimated_time_delta_total',
  buckets: PREFECT_FLOW_RUN_BUCKETS,
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunCurrentTimeCount = new promClient.Counter({
  name: 'prefect_flow_run_active_time_total',
  help: 'total time taken for prefect flow runs while in an active state',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunCurrentTimeGauge = new promClient.Gauge({
  name: 'prefect_current_active_flow_run_time',
  help: 'current time taken for prefect flow runs while in an active state',
  labelNames: ['flow_name', 'tags', 'state'],
});

export const flowRunsCountTotal = () => {
  const { getFlowRuns, constructLabels } = stateManager;
  _.forEach(getFlowRuns(), (flowRun) => {
    if (flowRun.updated_state) {
      flowRunCountCounter.labels(constructLabels(flowRun)).inc(1);
    }
  });
};

export const flowRunsCount = () => {
  _.forEach(stateManager.getFlowRunsCount(), (flowRun) => {
    const { count, ...labels } = flowRun;
    flowRunCountGauge.labels(labels).set(count);
  });
};

export const flowRunTime = () => {
  const { getFlowRuns, getStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('TERMINAL'), flowRun.state_type)).forEach((flowRun) =>
    flowRunEndTimeCount.labels(constructLabels(flowRun)).inc(Math.round(flowRun.total_run_time)),
  );
};

export const flowRunEstimatedRunTime = () => {
  const { getFlowRuns, getStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('TERMINAL'), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedRunTimeCount.labels(constructLabels(flowRun)).inc(Math.round(flowRun.estimated_run_time)),
  );
};

export const flowRunCummulativeEndTime = () => {
  const { getFlowRuns, getStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('TERMINAL'), flowRun.state_type)).forEach((flowRun) =>
    flowRunEndTimeHist.labels(constructLabels(flowRun)).observe(Math.round(flowRun.total_run_time)),
  );
};

export const flowRunCummulativeEstimatedRunTime = () => {
  const { getFlowRuns, getStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('TERMINAL'), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedRunTimeHist.labels(constructLabels(flowRun)).observe(Math.round(flowRun.estimated_run_time)),
  );
};

export const flowRunManualTrigger = () => {
  const { getFlowRuns, getStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('TERMINAL'), flowRun.state_type)).forEach((flowRun) => {
    if (!flowRun.auto_scheduled) {
      flowRunManualTriggerCount.labels(constructLabels(flowRun)).inc(1);
    }
  });
};

export const flowRunEstimatedStartTimeDelta = () => {
  const { getFlowRuns, getStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('TERMINAL'), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedStartTimeDeltaCount
      .labels(constructLabels(flowRun))
      .inc(Math.round(flowRun.estimated_start_time_delta)),
  );
};

export const flowRunCummulativeEstimatedStartTimeDelta = () => {
  const { getFlowRuns, getStates, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('TERMINAL'), flowRun.state_type)).forEach((flowRun) =>
    flowRunEstimatedStartTimeDeltaHist
      .labels(constructLabels(flowRun))
      .observe(Math.round(flowRun.estimated_start_time_delta)),
  );
};

export const flowRunTimeActiveTotal = () => {
  const { getStates, getFlowRuns, constructLabels } = stateManager;
  _.filter(getFlowRuns(), (flowRun) => _.includes(getStates('ACTIVE'), flowRun.state_type)).forEach((flowRun) => {
    flowRunCurrentTimeCount
      .labels(constructLabels(flowRun))
      .inc(
        Math.round(
          (!flowRun.previous_time
            ? new Date(flowRun.current_time) - new Date(flowRun.start_time)
            : new Date(flowRun.current_time) - new Date(flowRun.previous_time)) / 1000,
        ),
      );
  });
};

export const flowRunTimeActive = () => {
  const { getStates, getFlowRuns, constructLabels } = stateManager;
  _.forEach(getFlowRuns(), (flowRun) => {
    if (_.includes(getStates('TERMINAL'), flowRun.state_type)) {
      flowRunCurrentTimeGauge
        .labels(constructLabels({ ...flowRun, state_type: flowRun.previous_state }))
        .dec(Math.round((new Date(flowRun.current_time) - new Date(flowRun.start_time)) / 1000));
    }

    if (_.includes(getStates('ACTIVE'), flowRun.state_type)) {
      flowRunCurrentTimeGauge
        .labels(constructLabels(flowRun))
        .set(Math.round((new Date(flowRun.current_time) - new Date(flowRun.start_time)) / 1000));
    }
  });
};

export default async () => [
  flowRunsCount(),
  flowRunsCountTotal(),
  flowRunTime(),
  flowRunEstimatedRunTime(),
  flowRunCummulativeEndTime(),
  flowRunCummulativeEstimatedRunTime(),
  flowRunManualTrigger(),
  flowRunEstimatedStartTimeDelta(),
  flowRunCummulativeEstimatedStartTimeDelta(),
  flowRunTimeActiveTotal(),
  flowRunTimeActive(),
];
