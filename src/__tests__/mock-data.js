import _ from 'lodash';

const mockNewFlowRun = [
  {
    id: '69b95f48-3691-4494-ba5c-896d2b9b0c7a',
    name: 'quantum-camel',
    tags: [],
    parent_task_run_id: null,
    state_type: 'RUNNING',
    expected_start_time: '2023-06-27T22:46:32.702207+00:00',
    next_scheduled_start_time: null,
    start_time: '2023-06-27T22:49:20.932210+00:00',
    end_time: null,
    total_run_time: 0,
    estimated_run_time: 1.173413,
    estimated_start_time_delta: 16.045488,
    auto_scheduled: true,
    flow_name: 'my-test-flow',
    current_time: '2023-06-27T22:49:25.053Z',
    previous_time: undefined,
    previous_state: undefined,
    updated_state: true,
  },
];

const mockActiveFlowRun = [
  {
    id: '69b95f48-3691-4494-ba5c-896d2b9b0c7a',
    name: 'quantum-camel',
    tags: [],
    parent_task_run_id: null,
    state_type: 'RUNNING',
    expected_start_time: '2023-06-27T22:46:32.702207+00:00',
    next_scheduled_start_time: null,
    start_time: '2023-06-27T22:49:20.932210+00:00',
    end_time: null,
    total_run_time: 0,
    estimated_run_time: 1.173413,
    estimated_start_time_delta: 16.045488,
    auto_scheduled: true,
    flow_name: 'my-test-flow',
    current_time: '2023-06-27T22:49:35.245Z',
    previous_time: '2023-06-27T22:49:25.053Z',
    previous_state: undefined,
    updated_state: false,
  },
];

const mockTerminalFlowRun = [
  {
    id: '69b95f48-3691-4494-ba5c-896d2b9b0c7a',
    name: 'quantum-camel',
    tags: [],
    parent_task_run_id: null,
    state_type: 'COMPLETED',
    expected_start_time: '2023-06-27T22:00:00.080193+00:00',
    next_scheduled_start_time: null,
    start_time: '2023-06-27T22:49:20.839884+00:00',
    end_time: '2023-06-27T22:49:51.102563+00:00',
    total_run_time: 30.262679,
    estimated_run_time: 1.173413,
    estimated_start_time_delta: 16.045488,
    auto_scheduled: true,
    flow_name: 'my-test-flow',
    current_time: '2023-06-27T22:49:35.245Z',
    previous_time: '2023-06-27T22:49:35.245Z',
    previous_state: 'RUNNING',
    updated_state: true,
  },
];

const mockFlowRunCount = [
  { tags: '', state: 'SCHEDULED', count: 1 },
  { tags: '', state: 'PENDING', count: 10 },
  { tags: '', state: 'RUNNING', count: 0 },
  { tags: '', state: 'PAUSED', count: 0 },
  { tags: '', state: 'CANCELLING', count: 0 },
  { tags: '', state: 'COMPLETED', count: 4943 },
  { tags: '', state: 'FAILED', count: 0 },
  { tags: '', state: 'CANCELLED', count: 0 },
  { tags: '', state: 'CRASHED', count: 1255 },
];

const mockManualTriggerFlowRun = [
  {
    id: '07cde4d0-da4c-4f14-9bbb-7045c117a586',
    name: 'naughty-mole',
    tags: [],
    state_type: 'COMPLETED',
    expected_start_time: '2023-06-28T21:43:44.269025+00:00',
    start_time: '2023-06-28T21:43:50.837957+00:00',
    end_time: null,
    total_run_time: 0,
    estimated_run_time: 30.179882,
    estimated_start_time_delta: 6.568932,
    auto_scheduled: false,
    flow_name: 'my-test-flow',
    current_time: '2023-06-28T21:44:16.072Z',
    previous_state: 'RUNNING',
    updated_state: true,
  },
];

const mockFetchAllFlows = [
  {
    id: 'acb7f1c9-4ece-425f-892c-b32f5da3f4ae',
    created: '2023-06-10T22:38:07.178914+00:00',
    updated: '2023-06-10T22:38:07.178926+00:00',
    name: 'my-test-flow',
    tags: [],
  },
];

const mockFetchApi = async (metric) => {
  switch (metric) {
    case 'FLOWS_FILTER':
      return mockFetchAllFlows;
    case metric.match(/^FLOW_RUNS_COUNT_/):
      return _.find(mockFlowRunCount, { state: metric.split('_').pop() });
    default:
      return undefined;
  }
};

export default {
  mockNewFlowRun,
  mockActiveFlowRun,
  mockTerminalFlowRun,
  mockFlowRunCount,
  mockManualTriggerFlowRun,
  mockFetchApi,
};
