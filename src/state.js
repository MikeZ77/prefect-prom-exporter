import _ from 'lodash';
import fetchApi from './get-request.js';

const stateManager = () => {
  /**
   * The Prefect API only allows us to work with start_time for flow runs. Calling the API
   * to get all flow runs is too expensive, so this state manager keeps track of started
   * flow runs for the current time delta until their terminal state.
   */
  // TODO: Missing terminal state TimedOut
  const TERMINAL_STATES = ['COMPLETED', 'FAILED', 'CANCELLED', 'CRASHED'];
  const state = {
    prevPollTime: new Date().toISOString(),
    curPollTime: new Date().toISOString(),
    flowRuns: [],
    flowLabels: [],
  };

  const getTerminalStates = () => {
    return [...TERMINAL_STATES];
  };

  const getFlowRuns = () => {
    // return _.cloneDeep(state.flowRuns);
    return [...state.flowRuns];
  };

  const getFlowLabels = () => {
    return [...state.flowLabels];
  };

  const getTimeDelta = () => {
    return { prevPollTime: state.prevPollTime, curPollTime: state.curPollTime };
  };

  const setTimeDelta = (pollTime) => {
    state.prevPollTime = state.curPollTime;
    state.curPollTime = pollTime;
  };

  const fetchFlowRunsByStartTime = async () => {
    const [newFlowRuns, allFlows] = await Promise.all([
      fetchApi('FLOW_RUNS_FILTER_START_TIME', state.prevPollTime, state.curPollTime),
      fetchApi('FLOWS_FILTER'),
    ]);
    const allFlowsById = _.keyBy(allFlows, 'id');
    const updatedFlowRuns = await fetchApi('FLOW_RUNS_FILTER_ID', _.map([...newFlowRuns, ...state.flowRuns], 'id'));
    state.flowRuns = _.map(updatedFlowRuns, (flow) => ({ ...flow, flow_name: _.get(allFlowsById, flow.flow_id).name }));
  };
  const cleanupTerminalStates = () => {
    // TODO: flag flow runs to_delete one cycle before they are hard deleted.
    // The reason is that it allows us to reset a metric (gauage) before it does not exist.
    // It also allows us to cleanup metrics that have unique labels
    state.flowRuns = _.filter(state.flowRuns, (flowRun) => !_.includes(TERMINAL_STATES, flowRun.state_type));
  };

  const fetchFlowLabels = async () => {
    const data = await fetchApi('FLOWS_FILTER');
    state.flowLabels = _.map(data, (flow) => ({ name: flow.name, tags: flow.tags }));
  };

  return {
    getTerminalStates,
    getFlowRuns,
    getFlowLabels,
    getTimeDelta,
    setTimeDelta,
    fetchFlowRunsByStartTime,
    cleanupTerminalStates,
    fetchFlowLabels,
  };
};

export default stateManager();
