import 'dotenv/config';
import express from 'express';
import promClient from 'prom-client';
import { fetchFlows } from './src/prefect-flows.js';

const port = process.env.SCRAPE_INTERVAL || 3000;
const scrapeInterval = process.env.SCRAPE_INTERVAL || 30000;
const metricsPath = process.env.METRICS_PATH || '/metrics';

const app = express();

app.get(metricsPath, async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (e) {
    res.status(500).end(e);
  }
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, scrapeInterval));
    await Promise.all([fetchFlows()]);
  }
});
