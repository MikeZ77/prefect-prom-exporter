import promClient from 'prom-client';
import _ from 'lodash';
import stateManager from './state.js';

const flowRunLogCounter = new promClient.Counter({
  name: 'prefect_flow_run_logs',
  help: 'total number of prefect logs',
  labelNames: ['flow_name', 'tags', 'level'],
});

// TODO: Logs for task level
// TODO: Histogram
// eslint-disable-next-line import/prefer-default-export
const logCount = () => {
  const { getLogs, constructLabels } = stateManager;
  _.forEach(getLogs(), (log) => {
    if (log.flow_name) {
      flowRunLogCounter.labels(constructLabels(log)).inc(1);
    }
  });
};

export default async () => [logCount()];
