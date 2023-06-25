// import promClient from 'prom-client';
// import fetchApi from './get-request.js';
// import stateManager from './state.js';

// const flowsCount = new promClient.Gauge({
//   name: 'prefect_flows',
//   help: 'Prefect flows total count based on tag and work_pool',
//   // labelNames: ['tags'],
// });

// // eslint-disable-next-line import/prefer-default-export
// export const flowInformation = async () => {
//   const { getFlowRuns, constructLabels } = stateManager;
//   flowsCount.set(data);
// };

/*
TODO: 
  * Get all deployments (flows) Counter is_schedule_active~[1|0]
  * tags
  * schedule.interval
  * version
  * name
  * updated_by.display_value
*/
