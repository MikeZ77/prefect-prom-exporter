import { PREFECT_API_URL } from './get-env.js';

export const flowRunsStateT = (state, flowName) => {
  return {
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
  };
};

export const plaHolder = false;
