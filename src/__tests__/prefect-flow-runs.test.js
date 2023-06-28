// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, jest, beforeEach, expect } from '@jest/globals';
import _ from 'lodash';
import stateManager from '../state.js';
import mocks from './mock-data.js';
import {
  flowRunCountCounter,
  flowRunsCountTotal,
  flowRunCountGauge,
  flowRunsCount,
  flowRunEndTimeCount,
  flowRunTime,
  flowRunManualTriggerCount,
  flowRunManualTrigger,
  flowRunCurrentTimeCount,
  flowRunTimeActiveTotal,
} from '../prefect-flow-runs';

const mockGetFlowRuns = jest.spyOn(stateManager, 'getFlowRuns');
const mockGetFlowRunsCount = jest.spyOn(stateManager, 'getFlowRunsCount');
const flowRunCountCounterSpy = jest.spyOn(flowRunCountCounter, 'inc');
const flowRunCountGaugeSpy = jest.spyOn(flowRunCountGauge, 'set');
const flowRunEndTimeCountSpy = jest.spyOn(flowRunEndTimeCount, 'inc');
const flowRunManualTriggerCountSpy = jest.spyOn(flowRunManualTriggerCount, 'inc');
const flowRunCurrentTimeCountSpy = jest.spyOn(flowRunCurrentTimeCount, 'inc');
const labelsMock = jest.fn().mockReturnThis();
flowRunCountCounter.labels = labelsMock;
flowRunCountGauge.labels = labelsMock;
flowRunEndTimeCount.labels = labelsMock;
flowRunManualTriggerCount.labels = labelsMock;
flowRunCurrentTimeCount.labels = labelsMock;

const expectedLabel = (state) => ({
  flow_name: 'my-test-flow',
  state,
  tags: '',
});

describe('flowRunsCountTotal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('increments the count when the flow run is new or its state has changed', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockNewFlowRun);
    flowRunsCountTotal();
    expect(labelsMock).toHaveBeenCalledTimes(1);
    expect(labelsMock).toHaveBeenCalledWith(expectedLabel('RUNNING'));
    expect(flowRunCountCounterSpy).toHaveBeenCalledTimes(1);
    expect(flowRunCountCounterSpy).toHaveBeenCalledWith(1);
  });

  it('does not increment the count when the flow run has been seen and the state has not changes', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockActiveFlowRun);
    expect(labelsMock).toHaveBeenCalledTimes(0);
    expect(flowRunCountCounterSpy).toHaveBeenCalledTimes(0);
  });

  it('sets the correct label when the flow run has entered a new state', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockTerminalFlowRun);
    flowRunsCountTotal();
    expect(labelsMock).toHaveBeenCalledTimes(1);
    expect(labelsMock).toHaveBeenCalledWith(expectedLabel('COMPLETED'));
  });

  it('incrments the count when the flow run has entered a new state', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockTerminalFlowRun);
    flowRunsCountTotal();
    expect(flowRunCountCounterSpy).toHaveBeenCalledTimes(1);
    expect(flowRunCountCounterSpy).toHaveBeenCalledWith(1);
  });
});

describe('flowRunsCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets the correct count for every state', () => {
    mockGetFlowRunsCount.mockReturnValue(mocks.mockFlowRunCount);
    flowRunsCount();
    expect(flowRunCountGaugeSpy).toHaveBeenCalledTimes(mocks.mockFlowRunCount.length);
    _.forEach(mocks.mockFlowRunCount, (value, index) =>
      expect(flowRunCountGaugeSpy).toHaveBeenNthCalledWith(index + 1, value.count),
    );
  });
});

describe('flowRunTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not count for an active flow run', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockActiveFlowRun);
    flowRunTime();
    expect(labelsMock).toHaveBeenCalledTimes(0);
    expect(flowRunEndTimeCountSpy).toHaveBeenCalledTimes(0);
  });

  it('sets the correct label for a finished flow run', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockTerminalFlowRun);
    flowRunTime();
    expect(labelsMock).toHaveBeenCalledTimes(1);
    expect(labelsMock).toHaveBeenCalledWith(expectedLabel('COMPLETED'));
  });

  it('it increments the count for a finished flow run by the amount of time taken', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockTerminalFlowRun);
    const [{ total_run_time: expectedTotalTime }] = mocks.mockTerminalFlowRun;
    flowRunTime();
    expect(flowRunEndTimeCountSpy).toHaveBeenCalledTimes(1);
    expect(flowRunEndTimeCountSpy).toHaveBeenCalledWith(Math.round(expectedTotalTime));
  });
});

describe('flowRunManualTrigger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not count for an active flow run', () => {
    mockGetFlowRuns.mockReturnValue([
      {
        ...[mocks.mockManualTriggerFlowRun],
        state_type: 'RUNNING',
        previous_state: undefined,
      },
    ]);
    flowRunManualTrigger();
    expect(labelsMock).toHaveBeenCalledTimes(0);
    expect(flowRunManualTriggerCountSpy).toHaveBeenCalledTimes(0);
  });

  it('sets the correct label for a finished flow run if it is a manual trigger', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockManualTriggerFlowRun);
    flowRunManualTrigger();
    expect(labelsMock).toHaveBeenCalledTimes(1);
    expect(labelsMock).toHaveBeenCalledWith(expectedLabel('COMPLETED'));
  });

  it('it increments the count for a finished flow run if it is a manual trigger', () => {
    mockGetFlowRuns.mockReturnValue(mocks.mockManualTriggerFlowRun);
    flowRunManualTrigger();
    expect(flowRunManualTriggerCountSpy).toHaveBeenCalledTimes(1);
    expect(flowRunManualTriggerCountSpy).toHaveBeenCalledWith(1);
  });

  describe('flowRunTimeActiveTotal', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('sets the correct label for an active flow run', () => {
      mockGetFlowRuns.mockReturnValue(mocks.mockActiveFlowRun);
      flowRunTimeActiveTotal();
      expect(labelsMock).toHaveBeenCalledTimes(1);
      expect(labelsMock).toHaveBeenCalledWith(expectedLabel('RUNNING'));
    });

    it('incrments the the time now by the current time in the previous active flow run', () => {
      jest.spyOn(new Date('2023-06-27T22:49:40.245Z'), 'getTime').mockImplementation(() => 1687906180245);
      // const [{ current_time: currentTime }] = mocks.mockActiveFlowRun;
      mockGetFlowRuns.mockReturnValue(mocks.mockActiveFlowRun);
      flowRunTimeActiveTotal();
      expect(flowRunCurrentTimeCountSpy).toHaveBeenCalledTimes(1);
      expect(flowRunCurrentTimeCountSpy).toHaveBeenCalledWith(5);
    });
  });
});
