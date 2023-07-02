// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, expect, beforeAll } from '@jest/globals';
import _ from 'lodash';
import stateManager from '../state.js';
import mocks from './mock-data.js';

const { fetchFlowRunsCount, getFlowRunsCount, fetchFlowRunsByStartTime, getFlowRuns, cleanupTerminalStates } =
  stateManager;

const updateNewFlowRun = async () => {
  const { buildSendRequestFlowRuns, stripTrackingFields, mockFetchAllFlows, mockNewFlowRun } = mocks;
  const mockNewFlowRunFromApi = stripTrackingFields(mockNewFlowRun);

  await fetchFlowRunsByStartTime(
    buildSendRequestFlowRuns(
      () => [mockNewFlowRunFromApi],
      () => mockFetchAllFlows,
      () => [mockNewFlowRunFromApi],
    ),
  );
};

const updateActiveFlowRun = async () => {
  const { buildSendRequestFlowRuns, stripTrackingFields, mockFetchAllFlows, mockActiveFlowRun } = mocks;
  const mockActiveFlowRunFromApi = stripTrackingFields(mockActiveFlowRun);

  await fetchFlowRunsByStartTime(
    buildSendRequestFlowRuns(
      () => [mockActiveFlowRunFromApi],
      () => mockFetchAllFlows,
      () => [mockActiveFlowRunFromApi],
    ),
  );
};

const updateTerminalFlowRun = async () => {
  const { buildSendRequestFlowRuns, stripTrackingFields, mockFetchAllFlows, mockTerminalFlowRun } = mocks;
  const mockTerminalFlowRunFromApi = stripTrackingFields(mockTerminalFlowRun);

  await fetchFlowRunsByStartTime(
    buildSendRequestFlowRuns(
      () => [mockTerminalFlowRunFromApi],
      () => mockFetchAllFlows,
      () => [mockTerminalFlowRunFromApi],
    ),
  );
};

describe('fetchFlowRunsCount', () => {
  let flowRunsCount;

  beforeAll(async () => {
    await fetchFlowRunsCount(mocks.mockSendRequestCount);
    flowRunsCount = getFlowRunsCount();
  });

  it('should have a flow run count for each and every prefect state', async () => {
    const { getStates } = stateManager;
    expect(
      getStates().length === flowRunsCount.length && _(getStates()).every((state) => _.some(flowRunsCount, { state })),
    ).toBe(true);
  });

  it('should have the correct count for each state in the same order', () => {
    const { mockFlowRunCount } = mocks;
    expect(_.isEqual(_.map(flowRunsCount, 'count'), _.map(mockFlowRunCount, 'count'))).toBe(true);
  });

  it('should have the tags appended to each of the metrics', () => {
    expect(_(flowRunsCount).every((metric) => _.has(metric, 'tags'))).toBe(true);
  });
});

describe('fetchFlowRunsByStartTime', () => {
  it('should return no new flow runs to state if there are no new flow runs fetched', async () => {
    const { buildSendRequestFlowRuns, mockFetchAllFlows } = mocks;
    await fetchFlowRunsByStartTime(
      buildSendRequestFlowRuns(
        () => [],
        () => mockFetchAllFlows,
        () => [],
      ),
    );
    expect(getFlowRuns()).toHaveLength(0);
  });

  it('should update state for a new flow run with the correct tracking fields added', async () => {
    await updateNewFlowRun();
    const flowRuns = getFlowRuns();
    expect(flowRuns).toHaveLength(1);

    const [
      {
        current_time: currentTime,
        previous_time: previousTime,
        previous_state: previousState,
        updated_state: updatedState,
      },
    ] = flowRuns;

    expect(currentTime).toBeInstanceOf(Date);
    expect(previousTime).toBeUndefined();
    expect(previousState).toBeUndefined();
    expect(updatedState).toBe(true);
  });

  it(
    'should update state for a new flow run transitioning to an active flow run with the correct' +
      ' tracking fields added',
    async () => {
      await updateNewFlowRun();
      await updateActiveFlowRun();
      const flowRuns = getFlowRuns();

      const [
        {
          current_time: currentTime,
          previous_time: previousTime,
          previous_state: previousState,
          updated_state: updatedState,
        },
      ] = flowRuns;

      expect(currentTime).toBeInstanceOf(Date);
      expect(previousTime).toBeInstanceOf(Date);
      expect(previousState).toBeUndefined();
      expect(updatedState).toBe(false);
    },
  );

  it(
    'should update state for an active flow run transitioning to finished flow run with the correct' +
      ' tracking fields added',
    async () => {
      await updateNewFlowRun();
      await updateActiveFlowRun();
      await updateTerminalFlowRun();
      const flowRuns = getFlowRuns();

      const [
        {
          current_time: currentTime,
          previous_time: previousTime,
          previous_state: previousState,
          updated_state: updatedState,
        },
      ] = flowRuns;

      expect(currentTime).toBeInstanceOf(Date);
      expect(previousTime).toBeInstanceOf(Date);
      expect(currentTime).toBe(previousTime);
      expect(previousState).toBe('RUNNING');
      expect(updatedState).toBe(true);
    },
  );

  it('should cleanup the finished flow run', async () => {
    await updateNewFlowRun();
    await updateActiveFlowRun();
    await updateTerminalFlowRun();
    cleanupTerminalStates();
    const flowRuns = getFlowRuns();

    expect(flowRuns).toHaveLength(0);
  });
});
