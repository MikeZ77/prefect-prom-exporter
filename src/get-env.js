export const PREFECT_API_URL = process.env.PREFECT_API_URL || 'http://127.0.0.1:4200/';
export const ENV = process.env.ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const SCRAPE_INTERVAL = process.env.SCRAPE_INTERVAL || 30000;
export const METRICS_PATH = process.env.METRICS_PATH || '/metrics';
export const PROJECT_TAGS = process.env.PROJECT_TAGS.split(',');
export const PROJECT_WORK_POOLS = process.env.PROJECT_WORK_POOLS.split(',');
