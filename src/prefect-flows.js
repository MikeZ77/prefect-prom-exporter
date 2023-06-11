import promClient from 'prom-client';
import fetch from 'node-fetch';

const prefectApi = process.env.PREFECT_API_URL || 'http://127.0.0.1:4200/';

const flowTotal = new promClient.Gauge({
  name: 'prefect_flows',
  help: 'Prefect flows per project ID or name',
  // labelNames: ['tags'],
});

export const fetchFlows = async () => {
  const response = await fetch(`${prefectApi}api/flows/filter`, {
    method: 'POST',
  });
  const data = await response.json();
  console.log(data);
  flowTotal.set(data.length);
};

export const doSomethingElse = async () => {
  console.log('Test');
};
