import { PREFECT_API_URL } from './get-env.js';

export const flowRunsStateT = (state, flowName) => ({
  url: `${PREFECT_API_URL}api/flow_runs/count`,
  options: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      flows: {
        name: {
          any_: [flowName],
        },
      },
      flow_runs: {
        state: {
          type: {
            any_: [state],
          },
        },
      },
    }),
  },
});

export const flowsT = () => ({
  url: `${PREFECT_API_URL}api/flows/filter`,
  options: { method: 'POST' },
});

export const flowsCountT = () => ({
  url: `${PREFECT_API_URL}api/flows/count`,
  options: { method: 'POST' },
});

export const healthT = () => ({
  url: `${PREFECT_API_URL}api/health`,
  options: { method: 'GET' },
});

export const workPoolsT = () => ({
  url: `${PREFECT_API_URL}api/work_pools/filter`,
  options: { method: 'POST' },
});

export const versionT = () => ({
  url: `${PREFECT_API_URL}api/version`,
  options: { method: 'GET' },
});

export const flowRunsStartTime = (after, before) => ({
  url: `${PREFECT_API_URL}api/flow_runs/filter`,
  options: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      flow_runs: {
        start_time: {
          before_: before,
          after_: after,
        },
      },
    }),
  },
});

export const flowRunsById = (flowRunIds) => ({
  url: `${PREFECT_API_URL}api/flow_runs/filter`,
  options: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      flow_runs: {
        id: {
          any_: [...flowRunIds],
        },
      },
    }),
  },
});

export const logsFilter = (after, before) => ({
  url: `${PREFECT_API_URL}api/logs/filter`,
  options: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      logs: {
        timestamp: {
          before_: before,
          after_: after,
        },
      },
    }),
  },
});

export const deploymentsFilter = () => ({
  url: `${PREFECT_API_URL}api/deployments/filter`,
  options: { method: 'POST' },
});
