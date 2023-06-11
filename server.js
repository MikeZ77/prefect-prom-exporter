import 'dotenv/config';
import express from 'express';
import promClient from 'prom-client';
import { SCRAPE_INTERVAL, PORT, METRICS_PATH } from './src/get-env.js';
import { fetchFlowsCount, fetchFlows } from './src/prefect-flows.js';
import {
  fetchFlowRunsScheduled,
  fetchFlowRunsPending,
  fetchFlowRunsRunning,
} from './src/prefect-flow-runs.js';

const app = express();
// TODO: Validate that work_pool and tags (projects) exist on the server.

app.get(METRICS_PATH, async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (e) {
    res.status(500).end(e);
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, SCRAPE_INTERVAL));
    const flowNames = await fetchFlows();
    console.log('FLOWS', flowNames);
    await Promise.all([
      fetchFlowsCount(),
      fetchFlowRunsScheduled(flowNames),
      fetchFlowRunsPending(flowNames),
      fetchFlowRunsRunning(flowNames),
    ]);
  }
});
