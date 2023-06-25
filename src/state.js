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
  const ACTIVE_STATES = ['RUNNING', 'PAUSED', 'CANCELLING'];
  const STARTING_STATES = ['SCHEDULED', 'PENDING'];

  const state = {
    prevPollTime: new Date().toISOString(),
    curPollTime: new Date().toISOString(),
    flowRuns: [],
    flowRunsCount: [],
    logs: [],
  };

  const getTerminalStates = () => {
    return [...TERMINAL_STATES];
  };

  const getActiveStates = () => {
    return [...ACTIVE_STATES];
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
      ...(prefectObject.name ? { flow_name: prefectObject.flow_name } : {}),
      ...(prefectObject.tags ? { tags: prefectObject.tags.toString() } : {}),
      ...(prefectObject.state_type ? { state: prefectObject.state_type } : {}),
      ...(prefectObject.level ? { level: prefectObject.level } : {}),
    };
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

    state.flowRuns = _.map(curFlowRuns, (currentflowRun) => {
      const flow = _.get(allFlowsById, currentflowRun.flow_id);
      const previousFlowRun = _.get(prevFlowRunsById, currentflowRun.id);

      return {
        ...currentflowRun,
        flow_name: flow.name,
        current_time: _.includes(TERMINAL_STATES, currentflowRun.state_type)
          ? previousFlowRun.current_time
          : new Date(),
        previous_state:
          previousFlowRun && currentflowRun.state_type !== previousFlowRun.state_type
            ? previousFlowRun.state_type
            : undefined,
        updated_state:
          !previousFlowRun || (previousFlowRun && currentflowRun.state_type !== previousFlowRun.state_type),
      };
    });

    //   _(flowRun)
    //     .thru((updatedFlowRun) => {
    //       const flow = _.get(allFlowsById, updatedFlowRun.flow_id);
    //       return { ...updatedFlowRun, flow_name: flow.name };
    //     })
    //     .thru((updatedFlowRun) => {
    //       // TODO: Change to if prev state != current state
    //       // Keep current_time: prevFlowRun.current_time for TERMINAL_STATES
    //       // For Counter, flag true if a flow run is new, otherwise flag false
    //       const prevFlowRun = _.get(prevFlowRunsById, updatedFlowRun.id);
    //       if (_.includes(TERMINAL_STATES, updatedFlowRun.state_type)) {
    //         return {
    //           ...updatedFlowRun,
    //           current_time: prevFlowRun.current_time,
    //         };
    //       }
    //       return updatedFlowRun;
    //     })
    //     .thru((updatedFlowRun) => {
    //       const prevFlowRun = _.get(prevFlowRunsById, updatedFlowRun.id);
    //       if (prevFlowRun && updatedFlowRun.state_type !== prevFlowRun.state_type) {
    //         return {
    //           ...updatedFlowRun,
    //           previous_state: prevFlowRun.state_type,
    //           updated_state: true,
    //         };
    //       }

    //       if (!prevFlowRun) {
    //         return { ...updatedFlowRun, updated_state: true };
    //       }
    //       return { ...updatedFlowRun, updated_state: false };
    //     })
    //     .thru((updatedFlowRun) => {
    //       if (_.includes(ACTIVE_STATES, updatedFlowRun.state_type)) {
    //         return { ...updatedFlowRun, current_time: new Date() };
    //       }
    //       return updatedFlowRun;
    //     })
    //     .value(),
  };

  const cleanupTerminalStates = () => {
    state.flowRuns = _.filter(state.flowRuns, (flowRun) => !_.includes(TERMINAL_STATES, flowRun.state_type));
  };

  const fetchFlowRunsCount = async () => {
    const allFlows = await fetchApi('FLOWS_FILTER');
    const flowLabels = _.map(allFlows, (flow) => ({ name: flow.name, tags: flow.tags }));
    const allStates = [...STARTING_STATES, ...ACTIVE_STATES, ...TERMINAL_STATES];

    const metrics = _.flatMap(allStates, (flowState) =>
      _.map(flowLabels, (labels) => async () => {
        const count = await fetchApi(`FLOW_RUNS_COUNT_${flowState}`, labels.name);
        return { ...constructLabels(labels), state: flowState, count };
      }),
    );

    state.flowRunsCount = await Promise.all(_.map(metrics, (fn) => fn()));
  };

  const fetchLogs = async () => {
    const logs = await fetchApi('LOGS_FILTER', state.prevPollTime, state.curPollTime);
    const flowRunsById = _.keyBy(state.flowRuns, 'id');
    state.logs = _(logs)
      .map((log) => {
        const flowRun = _.get(flowRunsById, log.flow_run_id);
        return flowRun ? { ...log, flow_name: flowRun.flow_name, tags: flowRun.tags } : undefined;
      })
      .filter(_.isObject);
  };

  const fetchData = async () => [fetchLogs(), fetchFlowRunsByStartTime(), fetchFlowRunsCount()];

  return {
    getTerminalStates,
    getActiveStates,
    getLogs,
    getFlowRuns,
    getFlowRunsCount,
    getTimeDelta,
    setTimeDelta,
    fetchData,
    constructLabels,
    cleanupTerminalStates,
  };
};

export default stateManager();
