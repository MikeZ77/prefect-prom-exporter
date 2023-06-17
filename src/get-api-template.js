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
