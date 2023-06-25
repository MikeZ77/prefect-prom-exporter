export const PREFECT_API_URL = process.env.PREFECT_API_URL || 'http://127.0.0.1:4200/';
export const PREFECT_ACCOUNT_ID = process.env.PREFECT_API_URL || '';
export const PREFECT_WORKSPACE_ID = process.env.PREFECT_WORKSPACE_ID || '';
export const ENV = process.env.ENV || 'development'; // TODO: Turn off logging color in producton
export const PORT = process.env.PORT || 3000;
export const SCRAPE_INTERVAL = process.env.SCRAPE_INTERVAL || 30000;
export const METRICS_PATH = process.env.METRICS_PATH || '/metrics';
export const PREFECT_FLOW_RUN_BUCKETS = (process.env.PREFECT_FLOW_RUN_BUCKETS || '0,1,10,60,300,1000').split(',');
