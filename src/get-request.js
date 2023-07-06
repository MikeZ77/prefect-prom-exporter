import fetch from 'node-fetch';
import _ from 'lodash';
import * as Api from './get-api-template.js';
import Logger from './get-logger.js';
import { PREFECT_API_KEY, PREFECT_ACCOUNT_ID, PREFECT_WORKSPACE_ID } from './get-env.js';

const config = {
  HEALTH: Api.healthT,
  VERSION: Api.versionT,
  FLOWS_COUNT: Api.flowsCountT,
  FLOWS_FILTER: Api.flowsT,
  FLOW_RUNS_COUNT_SCHEDULED: _.partial(Api.flowRunsStateT, 'SCHEDULED'),
  FLOW_RUNS_COUNT_PENDING: _.partial(Api.flowRunsStateT, 'PENDING'),
  FLOW_RUNS_COUNT_RUNNING: _.partial(Api.flowRunsStateT, 'RUNNING'),
  FLOW_RUNS_COUNT_COMPLETED: _.partial(Api.flowRunsStateT, 'COMPLETED'),
  FLOW_RUNS_COUNT_FAILED: _.partial(Api.flowRunsStateT, 'FAILED'),
  FLOW_RUNS_COUNT_CANCELLED: _.partial(Api.flowRunsStateT, 'CANCELLED'),
  FLOW_RUNS_COUNT_CRASHED: _.partial(Api.flowRunsStateT, 'CRASHED'),
  FLOW_RUNS_COUNT_PAUSED: _.partial(Api.flowRunsStateT, 'PAUSED'),
  FLOW_RUNS_COUNT_CANCELLING: _.partial(Api.flowRunsStateT, 'CANCELLING'),
  FLOW_RUNS_FILTER_START_TIME: Api.flowRunsStartTime,
  FLOW_RUNS_FILTER_ID: Api.flowRunsById,
  WORK_POOLS: Api.workPoolsT,
  LOGS_FILTER: Api.logsFilter,
  DEPLOYMENTS_FILTER: Api.deploymentsFilter,
};

class HTTPResponseError extends Error {
  constructor(response) {
    super(`[HTTP Error Response] status:${response.status} ${response.statusText} url:${response.url}`);
    this.response = response;
  }
}

const fetchApi = () => {
  const responseCache = {};

  const sendRequest = async (metric, ...args) => {
    const payload = args.length ? config[metric](...args) : config[metric]();
    if (PREFECT_API_KEY) {
      payload.options.headers = { ...payload.options.headers, ...{ Authorization: `Bearer ${PREFECT_API_KEY}` } };
      payload.url =
        `https://api.prefect.cloud/api/accounts/${PREFECT_ACCOUNT_ID}/workspaces/${PREFECT_WORKSPACE_ID}` +
        `/${payload.url.substring(payload.url.lastIndexOf('api') + 4, payload.url.length)}`;
    }
    try {
      const response = await fetch(...Object.values(payload));
      if (!response.ok) {
        throw new HTTPResponseError(response);
      }
      const data = await response.json();
      responseCache[metric] = data;
      return data;
    } catch (error) {
      Logger.error(error.message);
      return responseCache[metric];
    }
  };

  return sendRequest;
};

export default fetchApi();
