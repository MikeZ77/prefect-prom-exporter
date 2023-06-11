import fetch from 'node-fetch';

const prefectApi = process.env.PREFECT_API_URL || 'http://127.0.0.1:4200/';

export const config = {
  'api/flows/filter': {
    method: 'POST',
  },
};

export const fetchApi = async (metric) => {
  const response = await fetch(`${prefectApi}${metric}`, config[metric]);
  const data = await response.json();
  return data;
};
