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
    const curFlowRuns = await fetchApi('FLOW_RUNS_FILTER_ID', _.map([...newFlowRuns, ...state.flowRuns], 'id'));
    const [allFlowsById, prevFlowRunsById] = [_.keyBy(allFlows, 'id'), _.keyBy(state.flowRuns, 'id')];

    state.flowRuns = _.map(curFlowRuns, (flowRun) => {
      return _(flowRun)
        .thru((updatedFlowRun) => {
          const flow = _.get(allFlowsById, updatedFlowRun.flow_id);
          return { ...updatedFlowRun, flow_name: flow.name };
        })
        .thru((updatedFlowRun) => {
          const prevFlowRun = _.get(prevFlowRunsById, updatedFlowRun.id);
          return {
            ...updatedFlowRun,
            ...(prevFlowRun?.to_delete ? { to_delete: prevFlowRun.to_delete } : { to_delete: false }),
          };
        })
        .value();
    });
  };

  const cleanupTerminalStates = () => {
    /* Now flow run that is finished is kept in state one cycle longer so end actions can be performed:
      - allows metrics to be reset (gauage) before it does not exist
      - it also allows metrics that have unique labels to be cleaned up
    */
    state.flowRuns = _(state.flowRuns)
      .filter((flowRun) => !(_.includes(TERMINAL_STATES, flowRun.state_type) && flowRun.to_delete))
      .map((flowRun) => (_.includes(TERMINAL_STATES, flowRun.state_type) ? { ...flowRun, to_delete: true } : flowRun))
      .value();
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
