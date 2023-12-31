import 'dotenv/config';
import express from 'express';
import promClient from 'prom-client';
import Logger from './src/get-logger.js';
import { SCRAPE_INTERVAL, PORT, METRICS_PATH } from './src/get-env.js';
import stateManager from './src/state.js';
import prefectFlowRuns from './src/prefect-flow-runs.js';
import prefectRoot from './src/prefect-root.js';
import prefectLogs from './src/prefect-logs.js';
import prefectDeployments from './src/prefect-deployments.js';

const app = express();

app.get(METRICS_PATH, async (_, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

app.listen(PORT, async () => {
  Logger.info(`Server is running on port ${PORT}`);
  const { setTimeDelta, fetchData, cleanupTerminalStates } = stateManager;
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, SCRAPE_INTERVAL));
    setTimeDelta(new Date().toISOString());
    await Promise.all(await fetchData());
    await Promise.all([
      ...(await prefectRoot()),
      ...(await prefectFlowRuns()),
      ...(await prefectLogs()),
      ...(await prefectDeployments()),
    ]);
    cleanupTerminalStates();
  }
});
