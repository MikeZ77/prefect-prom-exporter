import 'dotenv/config';
import express from 'express';
import promClient from 'prom-client';
import Logger from './src/get-logger.js';
import { SCRAPE_INTERVAL, PORT, METRICS_PATH } from './src/get-env.js';
import { fetchFlowLabels } from './src/prefect-flows.js';
import prefectFlowRuns from './src/prefect-flow-runs.js';

const app = express();

app.get(METRICS_PATH, async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (e) {
    res.status(500).end(e);
  }
});

app.listen(PORT, async () => {
  Logger.info(`Server is running on port ${PORT}`);
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, SCRAPE_INTERVAL));
    const flowRuns = await prefectFlowRuns(fetchFlowLabels);
    await Promise.all(flowRuns);
  }
});
