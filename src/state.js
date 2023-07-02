import _ from 'lodash';
import fetchApi from './get-request.js';

const stateManager = () => {
  /**
   * The Prefect API only allows us to work with start_time for flow runs. Calling the API
   * to get all flow runs is too expensive, so this state manager keeps track of started
   * flow runs for the current time delta until their terminal state.
   */

  const TERMINAL_STATES = ['COMPLETED', 'FAILED', 'CANCELLED', 'CRASHED'];
  const ACTIVE_STATES = ['RUNNING', 'PAUSED', 'CANCELLING'];
  const STARTING_STATES = ['SCHEDULED', 'PENDING'];

  const pythonLogLevels = {
    50: 'CRITICAL',
    40: 'ERROR',
    30: 'WARNING',
    20: 'INFO',
    10: 'DEBUG',
  };

  const state = {
    prevPollTime: new Date().toISOString(),
    curPollTime: new Date().toISOString(),
    flowRuns: [],
    flowRunsCount: [],
    logs: [],
  };

  const getStates = (type) => {
    switch (type) {
      case 'STARTING':
        return [...STARTING_STATES];
      case 'ACTIVE':
        return [...ACTIVE_STATES];
      case 'TERMINAL':
        return [...TERMINAL_STATES];
      default:
        return [...STARTING_STATES, ...ACTIVE_STATES, ...TERMINAL_STATES];
    }
  };

  const getFlowRuns = () => {
    return [...state.flowRuns];
  };

  const getFlowRunsCount = () => {
    return [...state.flowRunsCount];
  };

  const getTimeDelta = () => {
    return { prevPollTime: state.prevPollTime, curPollTime: state.curPollTime };
  };

  const getLogs = () => {
    return [...state.logs];
  };

  const constructLabels = (prefectObject) => {
    return {
      ...(prefectObject.flow_name ? { flow_name: prefectObject.flow_name } : {}),
      ...(prefectObject.tags ? { tags: prefectObject.tags.toString() } : {}),
      ...(prefectObject.state_type ? { state: prefectObject.state_type } : {}),
      ...(prefectObject.level ? { level: _.get(pythonLogLevels, prefectObject.level) } : {}),
    };
  };

  const setTimeDelta = (pollTime) => {
    state.prevPollTime = state.curPollTime;
    state.curPollTime = pollTime;
  };

  const fetchFlowRunsByStartTime = async (sendRequest) => {
    const [newFlowRuns, allFlows] = await Promise.all([
      sendRequest('FLOW_RUNS_FILTER_START_TIME', state.prevPollTime, state.curPollTime),
      sendRequest('FLOWS_FILTER'),
    ]);

    const curFlowRuns = await sendRequest(
      'FLOW_RUNS_FILTER_ID',
      _.uniq(_.map([...newFlowRuns, ...state.flowRuns], 'id')),
    );

    const [allFlowsById, prevFlowRunsById] = [_.keyBy(allFlows, 'id'), _.keyBy(state.flowRuns, 'id')];
    state.flowRuns = _.map(curFlowRuns, (currentflowRun) => {
      const flow = allFlowsById[currentflowRun.flow_id];
      const previousFlowRun = prevFlowRunsById[currentflowRun.id];

      return {
        ...currentflowRun,
        flow_name: flow.name,
        current_time: _.includes(TERMINAL_STATES, currentflowRun.state_type)
          ? previousFlowRun.current_time
          : new Date(),
        previous_time: previousFlowRun && previousFlowRun.current_time,
        previous_state:
          previousFlowRun && currentflowRun.state_type !== previousFlowRun.state_type
            ? previousFlowRun.state_type
            : undefined,
        updated_state:
          !previousFlowRun || (previousFlowRun && currentflowRun.state_type !== previousFlowRun.state_type),
      };
    });
  };

  const cleanupTerminalStates = () => {
    state.flowRuns = _.filter(state.flowRuns, (flowRun) => !_.includes(TERMINAL_STATES, flowRun.state_type));
  };

  const fetchFlowRunsCount = async (sendRequest) => {
    const allFlows = await sendRequest('FLOWS_FILTER');
    const flowLabels = _.map(allFlows, (flow) => ({ name: flow.name, tags: flow.tags }));
    const allStates = [...STARTING_STATES, ...ACTIVE_STATES, ...TERMINAL_STATES];

    const metrics = _.flatMap(allStates, (flowState) =>
      _.map(flowLabels, (labels) => async () => {
        const count = await sendRequest(`FLOW_RUNS_COUNT_${flowState}`, labels.name);
        return { ...constructLabels(labels), state: flowState, count };
      }),
    );

    state.flowRunsCount = await Promise.all(_.map(metrics, (fn) => fn()));
  };

  const fetchLogs = async (sendRequest) => {
    const logs = await sendRequest('LOGS_FILTER', state.prevPollTime, state.curPollTime);
    const flowRunsById = _.keyBy(state.flowRuns, 'id');
    state.logs = _(logs)
      .map((log) => {
        const flowRun = flowRunsById[log.flow_run_id];
        return flowRun ? { ...log, flow_name: flowRun.flow_name, tags: flowRun.tags } : undefined;
      })
      .filter(_.isObject);
  };

  const fetchData = async () => [fetchLogs(fetchApi), fetchFlowRunsByStartTime(fetchApi), fetchFlowRunsCount(fetchApi)];

  return {
    getStates,
    getLogs,
    getFlowRuns,
    getFlowRunsCount,
    getTimeDelta,
    setTimeDelta,
    fetchData,
    fetchFlowRunsByStartTime,
    fetchFlowRunsCount,
    constructLabels,
    cleanupTerminalStates,
  };
};

export default stateManager();
