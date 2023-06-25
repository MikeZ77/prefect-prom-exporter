// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, jest, expect } from '@jest/globals';
import { flowRunsCountTotal } from '../prefect-flow-runs';
import stateManager from '../state.js';

const mockGetFlowRuns = jest.spyOn(stateManager, 'getFlowRuns').mockReturnValue([
  {
    id: '69b95f48-3691-4494-ba5c-896d2b9b0c7a',
    name: 'quantum-camel',
    tags: [],
    parent_task_run_id: null,
    state_type: 'RUNNING',
    expected_start_time: '2023-06-25T21:45:29.753428+00:00',
    next_scheduled_start_time: null,
    start_time: '2023-06-25T21:45:45.798916+00:00',
    end_time: null,
    total_run_time: 0,
    estimated_run_time: 1.173413,
    estimated_start_time_delta: 16.045488,
    auto_scheduled: false,
    flow_name: 'my-flow',
    current_time: '2023-06-25T21:45:46.974Z',
    previous_state: undefined,
    updated_state: true,
  },
]);

const mockFlowRunCountCounter = {
  labels: jest.fn().mockReturnThis(),
  inc: jest.fn(),
};

describe('flowRunsCountTotal', () => {
  it('increments the count when the flow is new or its state has changed', () => {
    flowRunsCountTotal();
    expect(mockGetFlowRuns).toHaveBeenCalled();
    expect(mockFlowRunCountCounter.labels).toHaveBeenCalledWith({
      flow_name: 'my-flow',
      tags: '',
      state_type: 'RUNNING',
    });
    expect(mockFlowRunCountCounter.inc).toHaveBeenCalledTimes(1);
  });
});
