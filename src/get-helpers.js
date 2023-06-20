import _ from 'lodash';
import fetchApi from './get-request.js';

// eslint-disable-next-line import/prefer-default-export
export const fetchFlowLabels = async (metricsFunc) => {
  const data = await fetchApi('FLOWS');
  const flowLabels = _.map(data, (flow) => ({ name: flow.name, tags: flow.tags }));
  return metricsFunc(flowLabels);
};

export const initFlowRunState = () => {
  /**
   * The Prefect API only allows us to work with start_time for flow runs. Calling the API
   * to get all flow runs is too expensive, so this state manager keeps track of started
   * flow runs for the current time delta until their terminal state.
   */
  const TERMINAL_STATES = ['COMPLETED', 'FAILED', 'CANCELLED', 'CRASHED'];
  const state = {
    prevPollTime: new Date().toISOString(),
    curPollTime: new Date().toISOString(),
    flowRuns: [],
  };

  const getFlowRuns = () => {
    return [...state.flowRuns];
  };

  const getTimeDelta = () => {
    return { prevPollTime: state.prevPollTime, curPollTime: state.curPollTime };
  };

  const setTimeDelta = (pollTime) => {
    state.prevPollTime = state.curPollTime;
    state.curPollTime = pollTime;
  };

  const fetchFlowRunsByStartTime = async () => {
    // console.log('state.prevPollTime, state.curPollTime', state.prevPollTime, state.curPollTime);
    const newFlowRuns = await fetchApi('FLOW_RUNS_START_TIME', state.prevPollTime, state.curPollTime);
    state.flowRuns = await fetchApi('FLOW_RUNS_BY_ID', _.map([...newFlowRuns, ...state.flowRuns], 'id'));
    // console.log('data', data);
    // console.log('fetchFlowRunsByStartTime', state.flowRuns);
  };
  const cleanupTerminalStates = () => {
    state.flowRuns = _.filter(state.flowRuns, (flowRun) => !_.includes(TERMINAL_STATES, flowRun.state_type));
    // console.log('cleanupTerminalStates', state.flowRuns);
  };

  return {
    getFlowRuns,
    getTimeDelta,
    setTimeDelta,
    fetchFlowRunsByStartTime,
    cleanupTerminalStates,
  };
};
